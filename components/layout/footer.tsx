import Link from "next/link";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    MapPin,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { footerNavItems } from "@/config/navigation";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            {/* Main Footer Content */}
            <div className="container px-4 py-12 md:px-6">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <span className="text-xl font-bold text-primary-foreground">
                                    C
                                </span>
                            </div>
                            <span className="text-2xl font-bold">{siteConfig.name}</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your one-stop destination for live cricket scores, match updates,
                            news, and comprehensive cricket coverage from around the world.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href={siteConfig.links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href={siteConfig.links.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link
                                href={siteConfig.links.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href={siteConfig.links.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Youtube className="h-5 w-5" />
                                <span className="sr-only">YouTube</span>
                            </Link>
                        </div>
                    </div>

                    {/* Footer Navigation Links */}
                    {footerNavItems.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h3 className="text-sm font-semibold">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.children?.map((item) => (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href}
                                            target={item.external ? "_blank" : undefined}
                                            rel={item.external ? "noopener noreferrer" : undefined}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {item.title}
                                            {item.external && (
                                                <span className="ml-1 text-xs text-muted-foreground/50">
                                                    ↗
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>support@cricketlive.com</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>
                                    123 Cricket Lane,
                                    <br />
                                    Mumbai, India 400001
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Bottom Bar */}
            <div className="container px-4 py-6 md:px-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="hover:text-foreground">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
