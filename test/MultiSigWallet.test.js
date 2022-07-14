/**
 * ============================================
 * MulitSigWalletコントラクト用のテストコード
 * ============================================
 */

// モジュールのインポート
const truffleAssert = require("truffle-assertions");
// コントラクトを読み込む
const MultiSigWallet = artifacts.require("MultiSigWallet");

/**
 * テストシナリオ
 * 2 of 3のマルチシグを想定
 */
contract ("MultiSigWallet Contract tests!!", accounts => {
    // owner用のアドレス
    const owners = [
        accounts[0],
        accounts[1],
        accounts[2]
    ];
    // 閾値
    const required = 2;
    // コントラクト用の変数
    var multiSigWallet;

    /**
     * テスト実行前の準備　
     */
    beforeEach (async () => {
        // MultiSigWalletコントラストのインスタンスを生成
        multiSigWallet = await MultiSigWallet.new(owners, required, {
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
    });
});