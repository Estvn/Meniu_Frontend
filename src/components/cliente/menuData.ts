import type { MenuCategories } from "./shared/restaurant-types";

export const menuCategories: MenuCategories = {
  Comidas: [
    {
      name: "Pastas",
      items: [
        {
          id: "pasta-carbonara",
          name: "Pasta Carbonara",
          description:
            "Espaguetis con panceta, huevo, queso parmesano y pimienta negra",
          price: 16.5,
          quantity: 0,
        },
        {
          id: "risotto-funghi",
          name: "Risotto ai Funghi",
          description: "Arroz cremoso con hongos porcini y queso parmesano",
          price: 19.99,
          quantity: 0,
        },
        {
          id: "lasagna",
          name: "Lasaña Bolognese",
          description: "Capas de pasta con carne, bechamel y queso gratinado",
          price: 18.0,
          quantity: 0,
        },
      ],
    },
    {
      name: "Pizzas",
      items: [
        {
          id: "pizza-margherita",
          name: "Pizza Margherita",
          description: "Tomate, mozzarella fresca, albahaca y aceite de oliva",
          price: 14.5,
          quantity: 0,
        },
        {
          id: "pizza-quattro-stagioni",
          name: "Pizza Quattro Stagioni",
          description:
            "Tomate, mozzarella, jamón, champiñones, alcachofas y aceitunas",
          price: 17.5,
          quantity: 0,
        },
      ],
    },
    {
      name: "Carnes",
      items: [
        {
          id: "osso-buco",
          name: "Osso Buco",
          description: "Jarrete de ternera guisado con verduras y vino blanco",
          price: 24.5,
          quantity: 0,
        },
        {
          id: "saltimbocca",
          name: "Saltimbocca alla Romana",
          description: "Escalope de ternera con jamón serrano y salvia",
          price: 22.0,
          quantity: 0,
        },
      ],
    },
  ],
  Bebidas: [
    {
      name: "Vinos",
      items: [
        {
          id: "vino-tinto",
          name: "Vino Tinto Reserva",
          description: "Copa de vino tinto de la casa",
          price: 6.5,
          quantity: 0,
        },
        {
          id: "vino-blanco",
          name: "Vino Blanco Frizzante",
          description: "Copa de vino blanco espumoso",
          price: 7.0,
          quantity: 0,
        },
      ],
    },
    {
      name: "Refrescos",
      items: [
        {
          id: "agua-mineral",
          name: "Agua Mineral",
          description: "Agua mineral natural 500ml",
          price: 2.5,
          quantity: 0,
        },
        {
          id: "coca-cola",
          name: "Coca Cola",
          description: "Refresco de cola 330ml",
          price: 3.0,
          quantity: 0,
        },
      ],
    },
    {
      name: "Cafés",
      items: [
        {
          id: "espresso",
          name: "Espresso",
          description: "Café italiano tradicional",
          price: 2.0,
          quantity: 0,
        },
        {
          id: "cappuccino",
          name: "Cappuccino",
          description: "Espresso con leche espumada",
          price: 3.5,
          quantity: 0,
        },
      ],
    },
  ],
  Postres: [
    {
      name: "Helados",
      items: [
        {
          id: "gelato-vainilla",
          name: "Gelato de Vainilla",
          description: "Helado artesanal italiano de vainilla",
          price: 5.5,
          quantity: 0,
        },
        {
          id: "gelato-chocolate",
          name: "Gelato de Chocolate",
          description: "Helado artesanal de chocolate negro",
          price: 5.5,
          quantity: 0,
        },
      ],
    },
    {
      name: "Tradicionales",
      items: [
        {
          id: "tiramisu",
          name: "Tiramisú",
          description: "Postre italiano tradicional con café y mascarpone",
          price: 7.5,
          quantity: 0,
        },
        {
          id: "panna-cotta",
          name: "Panna Cotta",
          description: "Crema italiana con frutos rojos",
          price: 6.5,
          quantity: 0,
        },
      ],
    },
    {
      name: "Pasteles",
      items: [
        {
          id: "cannoli",
          name: "Cannoli Siciliani",
          description: "Tubitos de masa crujiente rellenos de ricotta",
          price: 6.0,
          quantity: 0,
        },
        {
          id: "torta-limone",
          name: "Torta al Limone",
          description: "Tarta de limón con merengue italiano",
          price: 7.0,
          quantity: 0,
        },
      ],
    },
  ],
};
