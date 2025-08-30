// ITEM

fetch("data/productos.json")
  .then((response) => response.json())
  .then((data) => {
    let catalogo = document.getElementById("div-juegos");
    let todasLasCards = "";

    data.forEach((producto) => {
      todasLasCards += `
        <div class="cards">
            <div class="card  shadow-sm">
                <img src="${producto.image}" class="card-img-top" alt="${
        producto.title
      }" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.title}</h5>
                    <p class="card-text text-muted">${producto.category}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5">$${producto.price.toLocaleString()}</span>
                        </div>
                        <button class="btn-agregar btn w-100 mt-2" data-id="${
                          producto.id
                        }">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });

    catalogo.innerHTML = `<div class="div-cards">${todasLasCards}</div>`;

    const botonesAgregar = document.querySelectorAll(".btn-agregar");
    botonesAgregar.forEach((boton) => {
      boton.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        agregarAlCarrito(id);
      });
    });
  })
  .catch((error) => {
    console.error("Error al cargar los productos:", error);
  });

// ITEM

// CARRITO
let carrito = [];

let productos = [
  {
    id: 1,
    title: "FC 25",
    price: 70000,
    category: "string",
    image: "assets/fifa25.png",
  },
  {
    id: 2,
    title: "Assassins Creed: Shadows",
    price: 120000,
    category: "string",
    image: "assets/assasins.webp",
  },
  {
    id: 3,
    title: "Mortal Kombat 1",
    price: 80000,
    category: "string",
    image: "assets/mk1.png",
  },
  {
    id: 4,
    title: "God of War: Ragnarok",
    price: 100000,
    category: "string",
    image: "assets/gowRagnar.webp",
  },
];
// CARRITO

// INTERFAZ DEL CARRITO
function interfazcarrito() {
  const container = document.getElementById("offcanvas-body");
  const total = document.getElementById("total");

  if (!total) {
    console.error("No se encontró el elemento con id 'total'");
    return;
  }
  if (!container) {
    console.error("No se encontró el elemento con id 'offcanvas-body'");
    return;
  }

  console.log("carrito actual:", carrito);

  if (carrito.length === 0) {
    container.innerHTML = `
            <p class="text-muted">El carrito está vacío</p>
            <div id="total"><strong>Total: $0.00</strong></div>
        `;
    return;
  }

  let totalPrecio = 0;
  let html = "";

  carrito.forEach((item) => {
    const subtotal = item.price * item.cantidad;
    totalPrecio += subtotal;

    html += `
            <div class="item-carrito ">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.title}" 
                         style="width: 50px; height: 50px; object-fit: cover;" class="me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.title}</h6>
                        <small class="text-muted">$${item.price.toLocaleString()} c/u</small>
                        <div class="d-flex align-items-center mt-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${
                              item.id
                            }, -1)">-</button>
                            <span class="mx-2">${item.cantidad}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${
                              item.id
                            }, 1)">+</button>
                            <button class="btn btn-sm btn-danger ms-2" onclick="eliminarProducto(${
                              item.id
                            })">🗑</button>
                        </div>
                    </div>
                   
                </div>
            </div>
        `;
  });

  container.innerHTML =
    html +
    `<div id="total"><strong>Total: $${totalPrecio.toLocaleString()}</strong><button class="btn-compra" onclick="realizarCompra()">
             Comprar Ahora
        </button></div>
     `;
}
interfazcarrito();
// INTERFAZ DEL CARRITO

// FUNCIONES DE CANTIDAD
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const itemcarrito = carrito.find((i) => i.id === id);

  if (itemcarrito) {
    itemcarrito.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      title: producto.title,
      price: producto.price,
      category: producto.category,
      image: producto.image,
      cantidad: 1,
    });

    Swal.fire({
      title: "Producto agregado",
      text: "Su producto fue agragado al carrito de compras",
      icon: "success",
    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  interfazcarrito();
}
function cambiarCantidad(id, cambio) {
  const item = carrito.find((item) => item.id === id);
  if (item) {
    item.cantidad += cambio;

    if (item.cantidad <= 0) {
      eliminarProducto(id);
      return;
    }

    interfazcarrito();
  }
}
function actualizarCantidad(id, nuevaCantidad) {
  const item = carrito.find((item) => item.id === id);
  item.cantidad = parseInt(nuevaCantidad);

  if (item.cantidad <= 0) {
    eliminarProducto(id);
    return;
  }

  interfazcarrito();
}
// FUNCIONES DE CANTIDAD

// FUNCIONES COMPLEMENTARIAS
function eliminarProducto(id) {
  const producto = carrito.findIndex((item) => item.id === id);
  if (producto > -1) {
    carrito.splice(producto, 1);
    Swal.fire({
      title: "Ha sido borrado",
      text: "El producto a sido eliminado del carrito",
      icon: "success",
    });
  }
  interfazcarrito();
}

function realizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  Swal.fire({
    title: "¿Quiere realizar la compra?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "¡Pago realizado!",
        text: "Transaccion realizada con exito.",
        icon: "success",
      });
      limpiarCarrito();
    }
  });
}

function limpiarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  interfazcarrito();
}
// FUNCIONES COMPLEMENTARIAS
