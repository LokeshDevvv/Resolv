import React from 'react';
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import RewardCard from "@/views/app/components/reward-card.tsx";
import img1 from "@/views/app/assets/image1.png";
import img2 from "@/views/app/assets/image2.png";
import img3 from "@/views/app/assets/image3.png";
import img4 from "@/views/app/assets/image4.png";
import img6 from "@/views/app/assets/image6.png";
import img7 from "@/views/app/assets/image7.png";
import img8 from "@/views/app/assets/image8.png";
import img9 from "@/views/app/assets/image9.png";
const AppRewards = () => {
    const {API} = React.useContext(AppContext);

    API.components.category.setDisplay(false);

    const products = [
        {
            title: 'Amazon',
            description: 'Online gift card for amazon...',
            points: 2500,
            image: img1
        },
        {
            title: 'Flipkart',
            description: 'Online gift card for flipkart...',
            points: 1000,
            image: img2
        },
        {
            title: 'Uber',
            description: 'Online gift for uber',
            points: 2500,
            image: img3
        },
        {
            title: 'Uber Eats',
            description: 'Online gift for uber eats',
            points: 2500,
            image: img4
        },
        {
            title: 'Grab',
            description: 'Online gift for grab',
            points: 2500,
            image: img6
        },
        {
            title: 'Bolt',
            description: 'Online gift for bolt..',
            points: 2500,
            image: img7
        },
        {
            title: 'Clear Trip',
            description: 'Online gift for Clear Trip...',
            points: 2500,
            image: img8
        },
        {
            title: 'Make My Trip',
            description: 'Online gift for Make My Trip...', 
            points: 2500,
            image: img9
        }
    ];
    return (
        <div className={'grid grid-cols-2 md:grid-cols-3 gap-6 lg:grid-cols-4'}>
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