// {
//     /* FORECAST */
// }
// <Collapsible open={openForecast} onOpenChange={setOpenForecast}>
//     <SidebarMenuItem>
//         <CollapsibleTrigger asChild>
//             <SidebarMenuButton isActive={openForecast}>
//                 <span>PPIC</span>
//                 <ChevronDown className="ml-auto h-4 w-4" />
//             </SidebarMenuButton>
//         </CollapsibleTrigger>
//     </SidebarMenuItem>

//     <CollapsibleContent>
//         <SidebarMenuSub>
//             {ppicItems.map((item) => (
//                 <SidebarMenuSubItem key={item.title}>
//                     <SidebarMenuButton asChild isActive={isPathActive(pathname, item.url)}>
//                         <Link href={item.url}>
//                             <item.icon className="h-4 w-4" />
//                             <span>{item.title}</span>
//                         </Link>
//                     </SidebarMenuButton>
//                 </SidebarMenuSubItem>
//             ))}
//         </SidebarMenuSub>
//     </CollapsibleContent>
// </Collapsible>;

// {
//     /* KEUANGAN */
// }
// <Collapsible open={openSales} onOpenChange={setOpenSales}>
//     <SidebarMenuItem>
//         <CollapsibleTrigger asChild>
//             <SidebarMenuButton isActive={openSales}>
//                 <span>Keuangan</span>
//                 <ChevronDown className="ml-auto h-4 w-4" />
//             </SidebarMenuButton>
//         </CollapsibleTrigger>
//     </SidebarMenuItem>

//     <CollapsibleContent>
//         <SidebarMenuSub>
//             {salesItems.map((item) => (
//                 <SidebarMenuSubItem key={item.title}>
//                     <SidebarMenuButton asChild isActive={isPathActive(pathname, item.url)}>
//                         <Link href={item.url}>
//                             <item.icon className="h-4 w-4" />
//                             <span>{item.title}</span>
//                         </Link>
//                     </SidebarMenuButton>
//                 </SidebarMenuSubItem>
//             ))}
//         </SidebarMenuSub>
//     </CollapsibleContent>
// </Collapsible>;

// {
//     /* SETTINGS */
// }
// <Collapsible open={openSettings} onOpenChange={setOpenSettings}>
//     <SidebarMenuItem>
//         <CollapsibleTrigger asChild>
//             <SidebarMenuButton isActive={openSettings}>
//                 <span>Pengaturan</span>
//                 <ChevronDown className="ml-auto h-4 w-4" />
//             </SidebarMenuButton>
//         </CollapsibleTrigger>
//     </SidebarMenuItem>

//     <CollapsibleContent>
//         <SidebarMenuSub>
//             {settingsItems.map((item) => (
//                 <SidebarMenuSubItem key={item.title}>
//                     <SidebarMenuButton asChild isActive={isPathActive(pathname, item.url)}>
//                         <Link href={item.url}>
//                             <item.icon className="h-4 w-4" />
//                             <span>{item.title}</span>
//                         </Link>
//                     </SidebarMenuButton>
//                 </SidebarMenuSubItem>
//             ))}
//         </SidebarMenuSub>
//     </CollapsibleContent>
// </Collapsible>;
