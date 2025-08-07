"use client"

import { Button } from "@/components/ui/button"
import { Provider } from "@supabase/supabase-js"
import { Github } from "lucide-react"
import { oAuthSignIn } from "./actions"


type OAuthProvider = {
    name: Provider,
    displayName: String,
    icon?: JSX.Element,
}

export function OAuthButton(){
    
    const oAuthProviders: OAuthProvider[] = [
    {
        name: 'github',
        displayName: 'Github',
        icon: <Github className="size-5"></Github>,
    }
    // Add more providers below
]

    return(
        <>
        {/* Display a list of authentication buttons from different providers */}
            {oAuthProviders.map(provider => (
                <Button 
                className="w-full flex items-center justify-center gap-2" 
                variant={"outline"}
                onClick={async () => {
                    await oAuthSignIn(provider.name)
                }}
                >
                    {provider.icon}
                    Log in with {provider.displayName}
                </Button>
            ))}
        </>
    )
}