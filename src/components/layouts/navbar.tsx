import { useSidebar } from "@/components/ui/sidebar";

import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { Kbd } from "../ui/kbd";
import { Button } from "../ui/button";
// Di Navbar component
export function Navbar() {
    const { toggleSidebar, state } = useSidebar(); // state bisa 'expanded' atau 'collapsed'

    return (
        <nav className="flex items-center justify-between bg-white px-4 py-4.5 border-b border-gray-200">
            <button
                onClick={toggleSidebar}
                className="space-x-1 flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md bg-gray-300/50 backdrop-blur-md shadow cursor-pointer hover:bg-gray-400/60 transition-all ease-in-out duration-300"
            >
                <span className="text-sm font-medium text-gray-500 flex items-center justify-center gap-1">
                    {state === "expanded" ? (
                        <>
                            <PanelLeftClose className="size-4" /> Close
                        </>
                    ) : (
                        <>
                            <PanelRightClose className="size-4" /> Open
                        </>
                    )}
                </span>
                <Kbd>⌘B</Kbd>
            </button>

            <div>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    className="text-gray-500 hover:text-gray-500"
                >
                    v{process.env.NEXT_PUBLIC_APP_VERSION}
                </Button>
            </div>
        </nav>
    );
}
