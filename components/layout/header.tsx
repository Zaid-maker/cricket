"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { siteConfig } from "@/config/site";
import { mainNavItems, mobileNavItems, type NavItem } from "@/config/navigation";

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Bar - Optional branding bar */}
            <div className="bg-primary">
                <div className="container flex h-8 items-center justify-between px-4 md:px-6">
                    <span className="text-xs font-medium text-primary-foreground">
                        🏏 Your #1 Source for Live Cricket Scores
                    </span>
                    <div className="hidden items-center gap-4 text-xs text-primary-foreground/80 sm:flex">
                        <Link href="/download" className="hover:text-primary-foreground">
                            Download App
                        </Link>
                        <span>|</span>
                        <Link href="/subscribe" className="hover:text-primary-foreground">
                            Subscribe
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            <MobileNav
                                items={mobileNavItems}
                                onClose={() => setIsMobileMenuOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">C</span>
                        </div>
                        <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
                            {siteConfig.name}
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        {mainNavItems.map((item) =>
                            item.children ? (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuTrigger className="h-9 px-3">
                                        {item.title}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {item.children.map((child) => (
                                                <ListItem
                                                    key={child.href}
                                                    title={child.title}
                                                    href={child.href}
                                                >
                                                    {child.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ) : (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "h-9 px-3",
                                                pathname === item.href && "bg-accent"
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )
                        )}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    {isSearchOpen ? (
                        <div className="flex items-center gap-2">
                            <Input
                                type="search"
                                placeholder="Search matches, teams..."
                                className="w-40 sm:w-64"
                                autoFocus
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>
                    )}

                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Live Indicator */}
                    <Button
                        variant="destructive"
                        size="sm"
                        className="hidden animate-pulse gap-1.5 sm:flex"
                        asChild
                    >
                        <Link href="/live">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                            </span>
                            LIVE
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}

// List Item Component for Navigation Menu
const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    href={href || "#"}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

// Mobile Navigation Component
function MobileNav({
    items,
    onClose,
}: {
    items: NavItem[];
    onClose: () => void;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            {/* Mobile Header */}
            <div className="flex h-14 items-center justify-between border-b px-4">
                <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <span className="text-lg font-bold text-primary-foreground">C</span>
                    </div>
                    <span className="text-xl font-bold">{siteConfig.name}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Mobile Search */}
            <div className="border-b p-4">
                <Input type="search" placeholder="Search matches, teams..." />
            </div>

            {/* Mobile Menu Items */}
            <nav className="flex-1 overflow-auto p-4">
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-accent",
                                    pathname === item.href && "bg-accent"
                                )}
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Live Button */}
            <div className="border-t p-4">
                <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={onClose}
                    asChild
                >
                    <Link href="/live">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                        </span>
                        View Live Matches
                    </Link>
                </Button>
            </div>
        </div>
    );
}
