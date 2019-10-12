// module.exports = {
//   getAllClients(db: any) {
//     let clientList: any = [];
//     db.collection("clients")
//       .get()
//       .then((snapshot: any) => {
//         snapshot.forEach((doc: any) => {
//           clientList.push(doc.data());
//         });
//       });
//     return clientList;
//   }
// };
