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

### 必要機能
1. ウォレット作成画面
2. ウォレット詳細画面(トランザクションデータ)
3. ウォレット一覧画面(Home画面)

### デプロイ結果

```cmd
Starting migrations...
======================
> Network name:    'goreli'
> Network id:      5
> Block gas limit: 29999972 (0x1c9c364)


2_factory_deploy.js
===================

   Deploying 'WalletFactory'
   -------------------------
   > transaction hash:    0x4c7bc57be1138bba71ebeca98c15335f7eda29fd277f2108d9ed008d2b4ecdab
   > Blocks: 0            Seconds: 13
   > contract address:    0x3c955E552Fd383435765313330301c23f014e0a6
   > block number:        7246924
   > block timestamp:     1658128962
   > account:             0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
   > balance:             63.796987607823851171
   > gas used:            2945970 (0x2cf3b2)
   > gas price:           1.50000005 gwei
   > value sent:          0 ETH
   > total cost:          0.0044189551472985 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 7246925)
   > confirmation number: 2 (block: 7246926)
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.0044189551472985 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.0044189551472985 ETH
```

```cnd
Starting migrations...
======================
> Network name:    'munbai'
> Network id:      80001
> Block gas limit: 20000000 (0x1312d00)


2_factory_deploy.js
===================

   Deploying 'WalletFactory'
   -------------------------
   > transaction hash:    0xf04e28434f351f7cdf404ea9381a260da68ce074c69f0ce82de4dd9263c2dc37
   > Blocks: 73           Seconds: 368
   > contract address:    0xFEbf942Ce0f403a48a01D4757710289E0458bca9
   > block number:        27223555
   > block timestamp:     1658129418
   > account:             0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
   > balance:             11.93849754166501465
   > gas used:            2945970 (0x2cf3b2)
   > gas price:           2.50000001 gwei
   > value sent:          0 ETH
   > total cost:          0.0073649250294597 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 27223556)
   > confirmation number: 2 (block: 27223557)
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.0073649250294597 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.0073649250294597 ETH
```

### 参考文献
1. <a href="https://lab.miguelmota.com/ethereum-input-data-decoder/example/">InputDataDecoder</a>
2. <a href="https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html">Web3.jsのドキュメント</a>