/**
 * ============================================
 * MulitSigWalletコントラクト用のテストコード
 * ============================================
 */

// モジュールのインポート
const truffleAssert = require("truffle-assertions");
// コントラクトを読み込む
const MultiSigWallet = artifacts.require("MultiSigWallet");
const MyToken = artifacts.require("MyToken");

/**
 * test scenario
 * 2 of 3 MultiSig
 */
contract ("MultiSigWallet Contract tests!!", accounts => {
    // owner addresses
    const owners = [
        accounts[0],
        accounts[1],
        accounts[2]
    ];
    // required
    const required = 2;
    // multiSig Contract
    var multiSigWallet;
    // MyToken Contract
    var myToken;

    /**
     * テスト実行前の準備　
     */
    beforeEach (async () => {
        // deploy myToken contract
        myToken = await MyToken.new("WalletDepositToken", "WDT");
        // MultiSigWalletコントラストのインスタンスを生成
        multiSigWallet = await MultiSigWallet.new("test", owners, required, myToken.address, {
            from: accounts[0],
            gas: 5000000
        });
    });

    /**
     * コントラクトの初期設定関連のテストシナリオ
     */
    describe ("initialization", () => {
        // ownerアドレスを確認する
        it ("confirm owner address", async () => {
            // 3人のowner アドレスを取得する。
            var owner1 = await multiSigWallet.owners(0);
            var owner2 = await multiSigWallet.owners(1);
            var owner3 = await multiSigWallet.owners(2);
            // ownerアドレスが想定する値かどうかチェックする。
            assert.equal(owner1, accounts[0], "owner address must be match!!");
            assert.equal(owner2, accounts[1], "owner address must be match!!");
            assert.equal(owner3, accounts[2], "owner address must be match!!");
        });
        // 閾値を確認する。
        it ("confirm number of required", async () => {
            // 閾値を取得する。
            var req = await multiSigWallet.required();
            // チェックする。
            assert.equal(req, required, "number of required must be match!!");
        });
        // ウォレットの名前を確認する。
        it ("confirm name of wallet", async () => {
            // ウォレットの名前を取得する。
            var name = await multiSigWallet.walletName();
            // チェックする。
            assert.equal(name, "test", "name of wallet must be match!!");
        });
    });

    /**
     * 入金用のメソッド用のテストシナリオ
     */
    describe ("receive test", () => {
        it("deposit", async () => {
            // value of deposit
            const value = web3.utils.toWei('0.05');
            // execute a receive method
            const txHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: myToken.address,
                value: value
            });
            // execute a receive method
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: value
            });
            console.log("Tx Hash:", transactionHash.transactionHash);
            // トランザクションのデータを取得する。
            const txData = await web3.eth.getTransaction(transactionHash.transactionHash);
            console.log("txData:", txData);
            // コントラクトの残高をチェックする。
            const contractBalance = await web3.eth.getBalance(multiSigWallet.address);
            // amount of WDT 
            const amount = 0.05 * 100;
            // mint WDT
            await myToken.mint(accounts[3], amount);
            // チェックする。
            assert.equal(value, contractBalance, "balance must be match!!");
            assert.equal(amount, await myToken.balanceOf(accounts[3]), "WDT's balance must be match!!");
        });
    });

    /**
     * トランザクションデータを作成するテストシナリオ
     */
    describe ("submit test", () => {
        // 正常系
        it("submit transaction", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.08')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // トランザクションデータを取得する。
            var txData = await multiSigWallet.transactions(0);
            // 各データについてチェックする。
            assert.equal(to, txData.to, "to must be match!!");
            assert.equal(value, txData.value, "value must be match!!");
            assert.equal(null, txData.data, "data must be match!!");
            assert.equal(false, txData.executed, "executed must be match!!");
        });
        // 異常系
        it("should be revert from invalid address", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.08')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // ownerアドレス以外から呼び出した時にエラーになることを確認する。
            await truffleAssert.reverts(
                multiSigWallet.submit(to, value, inputData, {
                    from: accounts[5] 
                })
            );
        });
    });

    /**
     * 承認系のテストシナリオ
     */
    describe ("approve test", () => {
        // 正常系
        it("approve transaction", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.08')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // チェック
            assert.equal(true, await multiSigWallet.approved(0, accounts[0]), "status of approvement must be match!!");
            assert.equal(true, await multiSigWallet.approved(0, accounts[1]), "status of approvement must be match!!");
        });
        // 異常系(owner以外のアドレスから承認しようとした場合)
        it("should be revert from invalid address", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.08')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // エラーになることを確認する。
            await truffleAssert.reverts(
                multiSigWallet.approve(0, {
                    from: accounts[5] 
                })
            );
        });
        // 異常系(存在しないTxIdを指定した場合)
        it("should be revert invalid txId", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.08')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // エラーになることを確認する。
            await truffleAssert.reverts(
                multiSigWallet.approve(1, {
                    from: accounts[0] 
                })
            );
        });
    });

    /**
     * トランザクション実行系のテストシナリオ
     */
    describe ("execute test", () => {
        // 正常系
        it("execute", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.1')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // トランザクションを実行する。
            await multiSigWallet.execute(0, {
                from: accounts[0],
                gas: 5000000
            }); 
            // トランザクションデータを取得する。
            var txData = await multiSigWallet.transactions(0);
            // チェック
            assert.equal(true, txData.executed, "executed must be match!!");
        });
        // 異常系(存在しないTxIdを指定した場合)
        it("should be revert invalid txId", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.08')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // エラーが発生することを確認する。
            await truffleAssert.reverts(
                multiSigWallet.execute(1, {
                    from: accounts[0]
                })
            );
        });
        // 没テスト
        // 異常系(owner以外から呼び出した場合)
        /*
        it("should be revert from invalid address", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.1')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // エラーが発生することを確認する。
            await truffleAssert.reverts(
                multiSigWallet.execute(0, {
                    from: accounts[4] 
                })
            );
        });
        */
        // 異常系(十分な数の承認を得ていない場合に実行しようとした場合)
        it("should be revert with insufficient approvement ", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.08')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner1人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            // エラーが発生することを確認する。
            await truffleAssert.reverts(
                multiSigWallet.execute(0, {
                    from: accounts[1] 
                })
            );
        });
        // 異常系(実行済みのトランザクションを再度実行しようとした場合)
        it("this tx is aleady executed", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.1')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // トランザクションを実行する。
            await multiSigWallet.execute(0, {
                from: accounts[0],
                gas: 5000000
            }); 
            // エラーが発生することを確認する。
            await truffleAssert.reverts(
                multiSigWallet.execute(0, {
                    from: accounts[0] 
                })
            );
        });
    });

    /**
     * トランザクションの承認を拒否するテストシナリオ
     */
     describe ("revoke test", () => {
        // 正常系
        it("revoke", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.1')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // 拒否する
            await multiSigWallet.revoke(0, {
                from: accounts[0] 
            });
            await multiSigWallet.revoke(0, {
                from: accounts[1] 
            });
            // チェックする
            assert.equal(false, await multiSigWallet.approved(0, accounts[0]), "status of approvement must be match!!");
            assert.equal(false, await multiSigWallet.approved(0, accounts[1]), "status of approvement must be match!!");
        });
        // 異常系(存在しないTxIdを指定した場合)
        it("should be revert invalid txId", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.1')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // 拒否する
            await truffleAssert.reverts(
                multiSigWallet.revoke(1, {
                    from: accounts[0] 
                })
            );
        });
        // 異常系(owner以外から呼び出した場合)
        it("should be revert from invalid address", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.1')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // owner2人により承認する。
            await multiSigWallet.approve(0, {
                from: accounts[0] 
            });
            //　もう一人から承認を得る。
            await multiSigWallet.approve(0, {
                from: accounts[1] 
            });
            // 拒否する
            await truffleAssert.reverts(
                multiSigWallet.revoke(0, {
                    from: accounts[3] 
                })
            );
        });
        // 異常系(未承認のトランザクションを拒否しようとした場合)
        it("should be revert from invalid address", async () => {
            // 前もってコントラクトにethを送金しておく.
            const transactionHash = await web3.eth.sendTransaction({
                from: accounts[3],
                to: multiSigWallet.address,
                value: web3.utils.toWei('0.1')
            });
            // 送金先アドレス  
            var to = accounts[4];
            // 送金額
            var value = web3.utils.toWei('0.1');
            // インプットデータ
            var inputData = "0x";
            // submitメソッドを呼びだす
            await multiSigWallet.submit(to, value, inputData, {
                from: accounts[0] 
            });
            // 拒否する
            await truffleAssert.reverts(
                multiSigWallet.revoke(1, {
                    from: accounts[0] 
                })
            );
        });
    });
});
