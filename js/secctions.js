window.isAnimating = false;

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.icon-toggle');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      if (window.isAnimating) return; // BLOQUEAR mientras anima

      // Quitar relleno a todos
      links.forEach(l => {
        const icon = l.querySelector('i');
        icon.classList.remove('bi-circle-fill');
        icon.classList.add('bi-circle');
      });

      // Activar el clicado
      const clickedIcon = link.querySelector('i');
      clickedIcon.classList.remove('bi-circle');
      clickedIcon.classList.add('bi-circle-fill');

      // Si se ha activado el punto2, lanza el evento y bloquea
      if (link.closest('.point2')) {
        window.isAnimating = true;
        window.dispatchEvent(new CustomEvent('rotateDownAndChangeColor'));
      }
    });
  });
});
