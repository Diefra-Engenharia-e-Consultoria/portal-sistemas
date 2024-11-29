// // Função para abrir o modal
// function openModal(modalId) {
//     var modal = document.getElementById(modalId);
//     modal.style.display = "block";  // Exibe o modal
// }

// // Função para fechar o modal
// function closeModal(modalId) {
//     var modal = document.getElementById(modalId);
//     modal.style.display = "none";  // Oculta o modal
// }

// // Seleciona todos os ícones SVG (que devem abrir seus respectivos modais)
// var svgIcons = document.querySelectorAll(".content svg");

// // Para cada ícone SVG, adiciona o evento de clique para abrir o modal
// svgIcons.forEach(function(svgIcon) {
//     svgIcon.addEventListener("click", function(event) {
//         var modalId = "myModal" + svgIcon.id.replace("openModalIcon", "");  // Monta o ID do modal
//         openModal(modalId);
//         event.preventDefault();  // Impede o comportamento padrão do link, caso tenha
//     });
// });

// // Seleciona todos os botões de fechar do modal
// var closeButtons = document.querySelectorAll(".close");

// // Para cada botão de fechar, adiciona o evento de clique para fechar o modal
// closeButtons.forEach(function(closeButton) {
//     closeButton.addEventListener("click", function() {
//         var modal = closeButton.closest(".modal");  // Encontra o modal mais próximo
//         modal.style.display = "none";  // Fecha o modal
//     });
// });

// // Fecha o modal se o usuário clicar fora do conteúdo do modal
// window.addEventListener("click", function(event) {
//     var modals = document.querySelectorAll(".modal");
//     modals.forEach(function(modal) {
//         if (event.target === modal) {
//             modal.style.display = "none";  // Fecha o modal
//         }
//     });
// });

function flipCard(card) {
    card.classList.toggle("flipped");
    console.log("teste");
}
