import React, {createContext} from "react";
import { toast } from "sonner"
import {Toaster} from "@/components/ui/sonner.tsx";
type AppContextType = {
    utils: {
        toast: typeof toast;
    },
    components: {
        aside: {
            currentPointer: string;
        },
        category: {
            display: boolean;
        }
    },
    API: {
        components: {
            aside: {
                setPointer: (pointer: string) => void;
            },
            category: {
                setDisplay: (display: boolean) => void;
            }
        }
    }
}
const AppContext = createContext<AppContextType>({} as AppContextType);

const AppContextProvider = ({children}: { children: React.ReactNode }) => {
    const [componentsAsidePointer, setComponentsAsidePointer] = React.useState<string>('');
    const [componentsCategoryDisplay, setComponentsCategoryDisplay] = React.useState<boolean>(true);
    const output: AppContextType = {
        utils: {
            toast
        },
        components: {
            aside: {
                currentPointer: componentsAsidePointer
            },
            category: {
                display: componentsCategoryDisplay
            }
        },
        API: {
            components: {
                aside: {
                    setPointer: setComponentsAsidePointer
                },
                category: {
                    setDisplay: setComponentsCategoryDisplay
                }
            }
        }
    }
    return (
        <AppContext.Provider value={output}>
            {children}
            <Toaster position="bottom-center" richColors closeButton />
        </AppContext.Provider>
    )
};

export {AppContext, AppContextProvider};