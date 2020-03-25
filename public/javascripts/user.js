
const axios = require('axios');

// Add send request functionality to plus on user_thumb partial
// var $friendAddBtns = document.querySelectorAll('.add-friend-btn');
// $friendAddBtns.forEach(($btn)=>{
//     debugger
//     var friendId = $btn.id;
//     $btn.addEventListener('click', function(eventElem) {
//         axios.get(`/user/add-friend/:${friendId}`)
//             .then((response)=> {
//                 // handle success
//                 if (response) {
//                     $btn.innerHTML = '<img src="" alt="" >'
//                 }
//                 console.log(response);
//             })
//             .catch(function (error) {
//                 // handle error
//                 console.log(error);
//             })
//             .then(function () {
//                 // always executed
//             });
//     })
// })

// function addFriend (element, friendId) {
//     axios.get(`/user/add-friend/:${friendId}`)
//         .then((response)=> {
//             // handle success
//             if (response) {
//                 element.innerHTML = '<img src="" alt="" >'
//             }
//             console.log(response);
//         })
//         .catch(function (error) {
//             // handle error
//             console.log(error);
//         })
//         .then(function () {
//             // always executed
//         });
// }