let web3;
let accounts = [];
const nftContractAddress = "0x44FAe7bbc2A0Bfd990E61fc0B38867710F8C970d"; // Thay bằng địa chỉ NFT của bạn

// ABI rút gọn cho ERC721
const abi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

let nftContract;

async function connectMetamask() {
  if (typeof window.ethereum !== "undefined") {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
    nftContract = new web3.eth.Contract(abi, nftContractAddress);

    document.getElementById("walletAddress").innerText = accounts[0];
    await updateBalances();
    await loadTransactionHistory();

    // 🔁 Theo dõi sự kiện chuyển NFT
    nftContract.events.Transfer({ fromBlock: "latest" })
      .on("data", async (event) => {
        console.log("Transfer event:", event);
        await updateBalances();
        await loadTransactionHistory();
      })
      .on("error", console.error);

  } else {
    alert("Cài đặt MetaMask để tiếp tục!");
  }
}

async function updateBalances() {
  const ethBalance = await web3.eth.getBalance(accounts[0]);
  const ethInEther = web3.utils.fromWei(ethBalance, "ether");
  document.getElementById("ethBalance").innerText = `${parseFloat(ethInEther).toFixed(4)} ETH`;

  const nftBalance = await nftContract.methods.balanceOf(accounts[0]).call();
  document.getElementById("nftBalance").innerText = `${nftBalance} NFT`;
}

async function loadTransactionHistory() {
  const events = await nftContract.getPastEvents("Transfer", {
    fromBlock: 0,
    toBlock: "latest",
  });

  const list = document.getElementById("txHistory");
  list.innerHTML = "";

  // Lọc ra các giao dịch có liên quan tới user hiện tại
  const filtered = events.filter(ev =>
    ev.returnValues.from.toLowerCase() === accounts[0].toLowerCase() ||
    ev.returnValues.to.toLowerCase() === accounts[0].toLowerCase()
  );

  if (filtered.length === 0) {
    list.innerHTML = "<li>Chưa có giao dịch nào.</li>";
    return;
  }

  filtered.reverse().forEach(ev => {
    const li = document.createElement("li");
    li.textContent = `TokenID ${ev.returnValues.tokenId} 
      ${ev.returnValues.from === "0x0000000000000000000000000000000000000000" 
        ? "minted →" 
        : `từ ${short(ev.returnValues.from)} →`} 
      ${short(ev.returnValues.to)}`;
    list.appendChild(li);
  });
}

function short(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// Gắn sự kiện
document.getElementById("connectBtn").addEventListener("click", connectMetamask);
