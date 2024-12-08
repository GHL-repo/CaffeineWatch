interface Icon {
    [key: string]: any;
  }
  
  export const icons: Icon = {
    coffeeDefault: require("../assets/icons/coffee-cup.png"),
    espresso: require("../assets/icons/espresso.png"),
    latte: require("../assets/icons/latte.png"),
    hotChocolate: require("../assets/icons/hot-chocolate.png"),
    pourOver: require("../assets/icons/dripper.png"),
    moka: require("../assets/icons/moka-pot.png"),
    coffeeCup2: require("../assets/icons/coffee-cup2.png"),
    decaf: require("../assets/icons/no-coffee.png"),
    tea: require("../assets/icons/tea.png"),
    herbalTea: require("../assets/icons/tea-cup.png"),
    matcha: require("../assets/icons/matcha-tea.png"),
    coffeeCup3: require("../assets/icons/coffee-cup3.png"),
    energyDrink: require("../assets/icons/energy-drink.png"),
    softDrink: require("../assets/icons/soft-drink.png"),
    sodaBottle: require("../assets/icons/soda-bottle.png"),
    trash: require("../assets/icons/trash.png"),
  };
  
  // Convert icons object to an array
  export const iconData = Object.entries(icons).map(([key, value]) => ({
    id: key,
    icon: value,
  }));
  