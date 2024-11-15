import React, {createContext} from "react";

type AppContextType = {
    components: {
        aside: {
            currentPointer: string;
        }
    },
    API: {
        components: {
            aside: {
                setPointer: (pointer: string) => void;
            }
        }
    }
}
const AppContext = createContext<AppContextType>({} as AppContextType);

const AppContextProvider = ({children}: { children: React.ReactNode }) => {
    const [componentsAsidePointer, setComponentsAsidePointer] = React.useState<string>('');
    const output: AppContextType = {
        components: {
            aside: {
                currentPointer: componentsAsidePointer
            }
        },
        API: {
            components: {
                aside: {
                    setPointer: setComponentsAsidePointer
                }
            }
        }
    }
    return (
        <AppContext.Provider value={output}>
            {children}
        </AppContext.Provider>
    )
};

export {AppContext, AppContextProvider};