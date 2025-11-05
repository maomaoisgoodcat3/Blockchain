require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    // mạng cục bộ Hardhat (tự sinh)
    hardhat: {},

    // mạng Ganache local (7545)
    localhost: {
      url: "http://127.0.0.1:7545",
      accounts: [
        // ⚠️ Dán private key của tài khoản đầu tiên trong Ganache vào đây
        "0xe25ef1193d30aeb588a68eea65ec148567f39cd02209bc33afc4dd915d8892ed"
      ],
    },
  },
};
