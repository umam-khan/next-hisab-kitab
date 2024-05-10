import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">iPhone 15 Pro</p>
          <p className="text-sm text-muted-foreground">
            Apple
          </p>
        </div>
        <div className="ml-auto font-medium">11,99,900 Rs</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>J</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Headphones</p>
          <p className="text-sm text-muted-foreground">JBL</p>
        </div>
        <div className="ml-auto font-medium">39,000 Rs</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>I</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">GPU Chips</p>
          <p className="text-sm text-muted-foreground">
            Intel
          </p>
        </div>
        <div className="ml-auto font-medium">2,99,000 Rs</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Playstation 5</p>
          <p className="text-sm text-muted-foreground">Sony</p>
        </div>
        <div className="ml-auto font-medium">99,000 Rs</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Smartphones</p>
          <p className="text-sm text-muted-foreground">Huwawei</p>
        </div>
        <div className="ml-auto font-medium">11,99,900 Rs</div>
      </div>
    </div>
  );
}
