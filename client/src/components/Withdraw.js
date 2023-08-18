// import { ethers } from "ethers";
// const Withdraw = ({ state }) => {
//     const withdraww= async(e)=>{
//     e.preventDefault();
//         const {contract} = state;
//         // const name = document.querySelector("#name").value;
//         console.log(contract)
//         const amount = { value: ethers.utils.parseEther("0.001") };
//         console.log(amount)
//         const transaction = await contract.withdraw(amount,"you can noty withdraw");
//         await transaction.wait();
//         console.log("Transaction is done");
//         console.log(amount)

//     }

//     return (
//       <>
//         <div className="container-md" style={{ width: "50%", marginTop: "25px" }}>
//           <form onSubmit={withdraww}>
//             <div className="mb-3">
//           </div>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={!state.contract}
//               >
//               Withdraw
//             </button>
//           </form>
//         </div>
//       </>
//     );
// }
// export default Withdraw;