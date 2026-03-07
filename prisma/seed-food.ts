import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding food items...');

    const foodItems = [
        { name: "Roti / Chapati (1 medium — 40 g)", calories: 120, protein: 3.9, carbs: 20.0, fat: 2.0, fiber: 2.2 },
        { name: "Idli (1 medium — ~39 g)", calories: 58, protein: 1.6, carbs: 12.0, fat: 0.4, fiber: 0.5 },
        { name: "Plain Dosa (1 medium — ~40 g)", calories: 104, protein: 3.1, carbs: 15.0, fat: 3.0, fiber: 1.0 },
        { name: "Aloo Paratha (1 medium — ~150 g)", calories: 340, protein: 7.0, carbs: 37.0, fat: 15.0, fiber: 4.0 },
        { name: "White Rice (1 cup cooked — ~158 g)", calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4, fiber: 0.6 },
        { name: "Brown Rice (1 cup cooked — ~195 g)", calories: 215, protein: 5.0, carbs: 44.4, fat: 1.7, fiber: 3.5 },
        { name: "Masoor / Toor Dal (1 cup cooked — ~200 g)", calories: 230, protein: 12.0, carbs: 40.0, fat: 1.2, fiber: 7.5 },
        { name: "Chole / Chana Masala (1 cup cooked — ~200 g)", calories: 270, protein: 12.0, carbs: 35.0, fat: 8.0, fiber: 12.0 },
        { name: "Paneer (100 g)", calories: 300, protein: 20.0, carbs: 4.0, fat: 22.0, fiber: 0.0 },
        { name: "Chicken Breast (100 g, cooked, plain)", calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, fiber: 0.0 },
        { name: "Rohu / Indian freshwater fish (100 g, raw/typical)", calories: 100, protein: 18.0, carbs: 0.0, fat: 2.5, fiber: 0.0 },
        { name: "Plain Curd / Dahi (100 g, whole-milk)", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0.0 },

        // eggs, fruits, biryani
        { name: "Egg — Large (1 large, whole — ~50 g)", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0.0 },
        { name: "Apple — Medium (1 medium — ~182 g)", calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, fiber: 4.4 },
        { name: "Banana — Medium (1 medium — ~118 g)", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4, fiber: 3.1 },
        { name: "Mango — Raw (1 cup pieces — 165 g)", calories: 99, protein: 1.4, carbs: 25.0, fat: 0.6, fiber: 2.6 },
        { name: "Orange — Medium (1 medium — ~140 g)", calories: 66, protein: 1.3, carbs: 14.8, fat: 0.2, fiber: 2.8 },
        { name: "Chicken Biryani (1 cup — ~200 g)", calories: 337, protein: 15.9, carbs: 44.9, fat: 10.1, fiber: 1.8 }
    ];

    for (const food of foodItems) {
        await prisma.foodItem.upsert({
            where: { name: food.name },
            update: food,
            create: food,
        });
    }

    console.log('Finished seeding food items.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
