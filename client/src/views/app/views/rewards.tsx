import React from 'react';
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import RewardCard from "@/views/app/components/reward-card.tsx";
import img1 from "@/views/app/assets/image 1.png";
import img2 from "@/views/app/assets/image 2.png";
import img3 from "@/views/app/assets/image 3.png";
import img4 from "@/views/app/assets/image 4.png";
import img6 from "@/views/app/assets/image 6.png";
import img7 from "@/views/app/assets/image 7.png";
import img8 from "@/views/app/assets/image 8.png";
import img9 from "@/views/app/assets/image 9.png";
const AppRewards = () => {
    const {API} = React.useContext(AppContext);

    API.components.category.setDisplay(false);

    const products = [
        {
            title: 'TShirt',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 2500,
            image: img1
        },
        {
            title: 'MacBook Air',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 1000,
            image: img2
        },
        {
            title: 'Laptop',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 2500,
            image: img3
        },
        {
            title: 'Headphones',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 2500,
            image: img4
        },
        {
            title: 'Smart Phone',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 2500,
            image: img6
        },
        {
            title: 'Tablet',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 2500,
            image: img7
        },
        {
            title: 'Camera',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 2500,
            image: img8
        },
        {
            title: 'Speaker',
            description: '2020 Tshirt MacBook Air Laptop...',
            points: 2500,
            image: img9
        }
    ];
    return (
        <div className={'grid grid-cols-2 md:grid-cols-3 gap-8 lg:grid-cols-4'}>
            {
                products.map((product, index) => (
                    <RewardCard
                        key={index}
                        title={product.title}
                        description={product.description}
                        points={product.points}
                        image={product.image}
                        onClick={() => {
                        }}
                    />
                ))
            }
        </div>
    );
};

export default AppRewards;