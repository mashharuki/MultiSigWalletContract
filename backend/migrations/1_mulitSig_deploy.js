/**
 * ============================================
 * MulitSigWalletコントラクト用のデプロイスクリプト
 * ============================================
 */

const MultiSigWallet = artifacts.require("MultiSigWallet");

module.exports = function (deployer, accounts) {
  // ウォレットの名前
  const walletName = "test";
  // owner用のアドレス
  const owners = [
    "0x3F1DDcCd05Fb848b448964A955e46D386fCF5742",
    "0x6CAA465BD4C99390f50e8954783AF31A13de87B1",
    "0x3d4565EB24DA70B1384a1e3eE7731b498f5C50b2"
  ];
  // 閾値
  const required = 2;

  deployer.deploy(MultiSigWallet, walletName, owners, required);
};
