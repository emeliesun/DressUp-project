let $sideMenuOpenButton = document.getElementById("sidemenu-open-btn");
$sideMenuOpenButton.addEventListener('click', (event)=> {
    let $sideMenuCloseBtn = document.getElementById("side-menu-close-btn");
    let $sideMenu = document.getElementById("sidemenu-box");
    $sideMenu.classList = "visible";
    $sideMenuCloseBtn.classList = "visible";
})

let $sideMenuCloseBtn = document.getElementById("sidemenu-close-btn");
$sideMenuCloseBtn.addEventListener('click', (event)=> {
    let $sideMenu = document.getElementById("sidemenu-box");
    $sideMenu.classList = "invisible";
    event.target.classList = "invisible";
})