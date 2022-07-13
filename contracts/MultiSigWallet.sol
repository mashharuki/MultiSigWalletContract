// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * MultiSigWalletコントラクト
 */
contract MultiSigWallet {

  // トランザクションデータ用の構造体を定義
  struct Transaction {
    // 送信先のアドレス
    address to;
    // 送金額
    uint value;
    // トランザクションのバイトデータ
    bytes data;
    // 実行済みのフラグ
    bool executed;
  }

  // Ownerのアドレスを格納する配列
  address[] public owners;
  // 閾値
  uint public required;
  // トランザクションデータを格納する配列
  Transaction[] public transations;
  
  // アドレスとowner権限の有無を紐付けるmap
  mapping(address => bool) public isOwner;
  // トランザクションID毎にonwerの承認状況を紐づけるmap
  mapping(uint => mapping(address => bool)) public approved;

  // 各種イベントの定義
  event Deposit(address indexed sender, uint amount);
  event Submit(uint indexed txId);
  event Approve(address indexed owner, uint indexed txId);
  event Revoke(address indexed owner, uint indexed txId);
  event Execute(uint indexed txId);

  /**
   * コンストラクター
   * @param _owners owner用のアドレスの配列
   * @param _required 閾値
   */
  constructor(address[] memory _owners, uint _required) {
    // 引数の内容をチェックする。
    require(_owners.length > 0, "number of owner addresses must be more than zero!!");
    require(_required > 0 && _required <= _owners.length, "invalid required number of owners");

    // ownerのアドレス群を配列とmapに詰めていく
    for(uint i; i < _owners.length; i++) {
      // ownerアドレスを取得する。
      address owner = _owners[i];
      // ownerのアドレスが条件を満たしているかチェックする。
      require(owner != address(0), "invalid address");
      // 同じアドレスが連続で登録されるのを防ぐ
      require(!isOwner[owner], "owner is not unique");
      // mapと配列にセットする。
      isOwner[owner] = true;
      owners.push(owner);
    }

    // 閾値を設定
    required = _required;
  }
}
