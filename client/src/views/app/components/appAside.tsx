import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import React from "react";
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import {ROUTES} from "@/constants/routes.tsx";
import {cn} from "@/lib/utils.ts";

const AppAside = () => {
    const {components} = React.useContext(AppContext)
    const links = [
        {
            name: 'Dashboard',
            route: ROUTES.app.dashboard
        },
        {
            name: 'My Reports',
            route: ROUTES.app.reports
        },
        {
            name: "Create new report",
            route: ROUTES.app['create-report']
        },
        {
            name: "Reward Points",
            route: ROUTES.app.rewards
        },
        {
            name: 'Follow Us',
            route: ROUTES.app['follow-us']
        },
        {
            name: 'Help & Feedback',
            route: ROUTES.app['help-feedback']
        }
    ];
    return (
        <div className={'gap-y-1 overflow-x-scroll flex md:flex-col items-start'}>
            {
                links.map((link, index) => {
                    return (
                        <Link to={link.route} key={index}>
                            <Button
                                variant={'link'}
                                className={cn(
                                    components.aside.currentPointer === link.route && 'underline text-[#4A8209]',
                                    'text-base'
                                )}
                            >{link.name}</Button>
                        </Link>
                    )
                })
            }
        </div>
    );
};

export default AppAside;