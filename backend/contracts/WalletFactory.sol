// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './MultiSigWallet.sol';

/**
 * WalletFactoryコントラクト
 */
contract WalletFactory {
    // MultiSigWallet型の配列
    MultiSigWallet[] public wallets;
    // 関数から返すことのできる最大値
    uint256 constant maxLimit = 20;

    // インスタンスが生成された時のイベント
    event WalletCreated (MultiSigWallet indexed wallet, string name, address[] owners, uint required);

    /**
     * MultiSigWalletのインスタンス数を取得する関数
     */
    function walletsCount () public view returns (uint256) {
        return wallets.length;
    }

    /**
     * MultiSigWalletのインスタンス生成関数
     * @param _name ウォレットの名前
     * @param _owners アドレスの配列
     * @param _required 閾値
     */
    function createWallet (
        string memory _name, 
        address[] memory _owners, 
        uint _required
    ) public {
        // インスタンスを生成
        MultiSigWallet wallet = new MultiSigWallet(_name, _owners, _required);
        // 配列に追加する。
        wallets.push(wallet);
        // イベントの発行
        emit WalletCreated(wallet, _name, _owners, _required);
    }

    /**
     * 作成済みウォレットの情報を取得するメソッド
     */
    function getWallets(uint256 limit, uint256 offset) public view returns (MultiSigWallet[] memory coll) {
        
        require (offset <= walletsCount(), "offset out of bounds");
        // 最大値を上回っている場合は、limitを格納する。
        uint256 size = walletsCount() - offset;
        size = size < limit ? size : limit;
        // sizeは、maxLimitを超えてはならない。
        size = size < maxLimit ? size : maxLimit;
        coll = new MultiSigWallet[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = wallets[offset + i];
        }

        return coll;    
    }
}