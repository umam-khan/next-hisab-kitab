"use client";

import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const supabase = createClientComponentClient();
    const router = useRouter();
    const handleSignOut = async ()  => {
        await supabase.auth.signOut();
        router.push("/sign-in")
    }
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          <span key={index} className="group flex items-center rounded-md text-sm font-medium">
            {item.href ? (
              <Link
                key={index}
                href={item.disabled ? "/" : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => {
                  // Execute logout function here
                  handleSignOut();
                  console.log("Logout function executed");
                }}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}



// export function DashboardNav({ items, setOpen }: DashboardNavProps) {
//   const path = usePathname();

//   if (!items?.length) {
//     return null;
//   }

//   return (
//     <nav className="grid items-start gap-2">
//       {items.map((item, index) => {
//         const Icon = Icons[item.icon || "arrowRight"];
//         return (
//           item.href && (
//             <Link
//               key={index}
//               href={item.disabled ? "/" : item.href}
//               onClick={() => {
//                 if (setOpen) setOpen(false);
//               }}
//             >
//               <span
//                 className={cn(
//                   "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//                   path === item.href ? "bg-accent" : "transparent",
//                   item.disabled && "cursor-not-allowed opacity-80",
//                 )}
//               >
//                 <Icon className="mr-2 h-4 w-4" />
//                 <span>{item.title}</span>
//               </span>
//             </Link>
//           )
//         );
//       })}
//     </nav>
//   );
// }
