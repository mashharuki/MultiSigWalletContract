# MultiSigWalletContract
MultiSigWalletを実装したスマートコントラクト用のリポジトリになります。

### テスト結果

```cmd
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: MultiSigWallet Contract tests!!
    initialization
      ✓ confirm owner address (88ms)
      ✓ confirm number of required
    receive test
Tx Hash: 0xbda6f8978f5d847c0a133ddcc7eef4fb7568eec8e86a0fd700fc21273eb0252a
txData: {
  hash: '0xbda6f8978f5d847c0a133ddcc7eef4fb7568eec8e86a0fd700fc21273eb0252a',
  nonce: 202,
  blockHash: '0x5cb1c50423d538e71dbd9affeb140227f0b9ed4a55cd6c5e70a109a1f395101e',
  blockNumber: 1050,
  transactionIndex: 0,
  from: '0x3bF9fc2AbD1bC95baaBBFC1c0a9D55573C9989f9',
  to: '0x95B2B2aeBFf5679eE742A25b729a026B9b921CdC',
  value: '50000000000000000',
  gas: 90000,
  gasPrice: '20000000000',
  input: '0x',
  v: '0x25',
  r: '0x826d0933924da1fc00cb1cb3850e8efd84d69b456d28e31127cba211d22b3786',
  s: '0x3ce0f037ae8351f948ee9163e8c3a6b670e603c3567f0ebf76ecf1e1fc9c3107'
}
      ✓ deposit (65ms)
    submit test
      ✓ submit transaction (329ms)
      ✓ should be revert from invalid address (513ms)
    approve test
      ✓ approve transaction (459ms)
      ✓ should be revert from invalid address (245ms)
      ✓ should be revert invalid txId (390ms)
    execute test
      ✓ execute (807ms)
      ✓ should be revert invalid txId (414ms)
      ✓ should be revert with insufficient approvement  (444ms)
      ✓ this tx is aleady executed (710ms)
    revoke test
      ✓ revoke (966ms)
      ✓ should be revert invalid txId (680ms)
      ✓ should be revert from invalid address (585ms)
      ✓ should be revert from invalid address (422ms)


  16 passing (10s)
```

### 参考文献
1. <a href="https://lab.miguelmota.com/ethereum-input-data-decoder/example/">InputDataDecoder</a>
2. <a href="https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html">Web3.jsのドキュメント</a>