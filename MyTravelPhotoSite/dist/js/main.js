const menuBtn = document.querySelector('.menu-btn');
const three = document.querySelector('.menu-btn_three');
const nav = document.querySelector('.nav');
const menuNav = document.querySelector('.menu-nav');
const navItems = document.querySelectorAll('.menu-nav_item');

let showMenu = false;

document.addEventListener('DOMContentLoaded', function() {
    menuBtn.addEventListener('click', toggleMenu);
})

function toggleMenu() {
    if(!showMenu) {
        three.classList.add('open');
        nav.classList.add('open');
        menuNav.classList.add('open');
        navItems.forEach(item => item.classList.add('open'));

        showMenu = true;
    } else {
        three.classList.remove('open');
        nav.classList.remove('open');
        menuNav.classList.remove('open');
        navItems.forEach(item => item.classList.remove('open'));

        showMenu = false;
    }
}