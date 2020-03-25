
// Add active class to the current button (highlight it)
var navigation = document.getElementById('navbox');
var navlink = navigation.getElementsByClassName('navlink');
for (var i = 0; i < navlink.length; i++) {
  navlink[i].addEventListener('click', function() {
    var current = document.getElementsByClassName('active');
    current[0].className = current[0].className.replace(' active', '');
    this.className += ' active';
  });
}
