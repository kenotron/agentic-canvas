# shadcn/ui Component Catalog
## Dashboard Workspace Application

**Version:** 1.0  
**Date:** August 2, 2025  
**Status:** Draft

---

## Overview

This document catalogs the shadcn/ui components that will be used throughout the Dashboard Workspace Application based on the UI/UX design specifications and component structure. The catalog is organized by component type and includes usage examples, props, and implementation guidance.

## Core Components

### 1. Button
**Usage:** Primary actions, navigation, form controls

```typescript
// Basic button
<Button>Click me</Button>

// With icon
<Button variant="outline">
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>

// Size variations
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading={isLoading}>Submit</Button>
```

### 2. Input
**Usage:** Form inputs, search fields, text entry

```typescript
<Input placeholder="Enter your email" />
<Input type="password" placeholder="Password" />

// With icon
<Input 
  placeholder="Search..." 
  prefix={<Search className="h-4 w-4" />} 
/>
```

### 3. Textarea
**Usage:** Multi-line text input, descriptions

```typescript
<Textarea 
  placeholder="Describe your dashboard..." 
  rows={4} 
/>
```

### 4. Select
**Usage:** Dropdown selections for configuration options

```typescript
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select connector" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="twitter">Twitter</SelectItem>
    <SelectItem value="linkedin">LinkedIn</SelectItem>
  </SelectContent>
</Select>
```

### 5. Dialog
**Usage:** Modal dialogs for forms, confirmations, and detailed views

```typescript
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Dashboard</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      Enter dashboard details
    </DialogDescription>
  </DialogContent>
</Dialog>
```

### 6. Sheet
**Usage:** Slide-in panels for mobile navigation, settings

```typescript
const [open, setOpen] = useState(false);

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

### 7. Alert
**Usage:** Status messages, warnings, errors

```typescript
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to connect to Twitter API
  </AlertDescription>
</Alert>
```

### 8. Card
**Usage:** Widget containers, dashboard cards, data displays

```typescript
<Card>
  <CardHeader>
    <CardTitle>Revenue Overview</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">$45,231.89</div>
  </CardContent>
</Card>
```

### 9. Badge
**Usage:** Status indicators, tags, metadata

```typescript
<Badge variant="secondary">Active</Badge>
<Badge variant="outline">Public</Badge>
```

### 10. Avatar
**Usage:** User avatars, profile pictures

```typescript
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## Form Components

### 11. Form
**Usage:** All forms including authentication, settings, and configuration

```typescript
const form = useForm({
  schema: z.object({ name: z.string() }),
  defaultValues: { name: "" }
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter name" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </form>
</Form>
```

### 12. Tabs
**Usage:** Multi-tabbed interfaces for settings, configuration

```typescript
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent value="general">
    <GeneralSettings />
  </TabsContent>
</Tabs>
```

### 13. Accordion
**Usage:** Collapsible sections in forms and settings

```typescript
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Connector Settings</AccordionTrigger>
    <AccordionContent>
      <ConnectorConfigForm />
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Data Display Components

### 14. Table
**Usage:** Data tables for metrics, connector lists, workflow history

```typescript
const columns = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "status",
    header: "Status"
  }
];

<DataTable 
  columns={columns} 
  data={connectors} 
/>
```

### 15. Pagination
**Usage:** Data pagination for large datasets

```typescript
<Pagination>
  <PaginationPrevious />
  <PaginationNext />
</Pagination>
```

### 16. Progress
**Usage:** Loading indicators, sync progress, completion status

```typescript
<Progress value={75} className="w-full" />
```

### 17. Skeleton
**Usage:** Loading states for widgets and data displays

```typescript
<Skeleton className="h-4 w-full" />
```

## Navigation Components

### 18. Navigation Menu
**Usage:** Main navigation, dropdown menus in header

```typescript
<NavigationMenu>
  <NavigationMenuItem>
    <NavigationMenuTrigger>Connectors</NavigationMenuTrigger>
    <NavigationMenuContent>
      <NavigationMenuLink>Twitter</NavigationMenuLink>
    </NavigationMenuContent>
  </NavigationMenuItem>
</NavigationMenu>
```

### 19. Breadcrumb
**Usage:** Navigation breadcrumbs for dashboards and artifacts

```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### 20. Sidebar
**Usage:** Left sidebar navigation with collapsible sections

```typescript
<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetContent side="left" className="w-80">
    <SidebarNav items={navItems} />
  </SheetContent>
</Sheet>
```

## Data Visualization Components

### 21. Chart
**Usage:** All chart types (line, bar, pie) for dashboard widgets

```typescript
<ChartContainer config={chartConfig}>
  <BarChart data={data}>
    <Bar dataKey="value" />
  </BarChart>
</ChartContainer>
```

### 22. Responsive Container
**Usage:** Charts and visualizations that adapt to container size

```typescript
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={data}>
    <Line dataKey="value" />
  </LineChart>
</ResponsiveContainer>
```

## Feedback Components

### 23. Toast
**Usage:** Notifications for user actions and system events

```typescript
toast({
  title: "Success",
  description: "Dashboard created successfully"
});
```

### 24. Tooltip
**Usage:** Hover information for dashboard elements

```typescript
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">?</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Widget configuration options</p>
  </TooltipContent>
</Tooltip>
```

### 25. Popover
**Usage:** Context menus, quick actions, dropdowns

```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Actions</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="p-2">
      <Button variant="ghost">Edit</Button>
      <Button variant="ghost">Delete</Button>
    </div>
  </PopoverContent>
</Popover>
```

## Layout Components

### 26. Grid
**Usage:** Dashboard grid layout system

```typescript
<Grid className="grid-cols-12 gap-4">
  <GridItem colSpan={4}>Widget 1</GridItem>
  <GridItem colSpan={8}>Widget 2</GridItem>
</Grid>
```

### 27. Layout
**Usage:** Main application layout structure

```typescript
<Layout className="h-screen">
  <Header />
  <div className="flex flex-1 overflow-hidden">
    <Sidebar />
    <MainCanvas />
  </div>
</Layout>
```

## Utility Components

### 28. Separator
**Usage:** Visual dividers in forms and lists

```typescript
<Separator className="my-4" />
```

### 29. Scroll Area
**Usage:** Scrollable content areas for long lists

```typescript
<ScrollArea className="h-64">
  <div className="p-4">Long content</div>
</ScrollArea>
```

### 30. Hover Card
**Usage:** Preview cards on hover for widgets and data

```typescript
<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent>
    <WidgetPreview />
  </HoverCardContent>
</HoverCard>
```

## Component Usage Patterns

### Dashboard Widget Pattern
```typescript
const WidgetContainer = ({ children, title }) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-1">
      {children}
    </CardContent>
  </Card>
);
```

### Form Pattern
```typescript
const ConfigForm = ({ onSubmit, onCancel }) => (
  <Form onSubmit={onSubmit}>
    <FormField name="name" label="Name" />
    <FormField name="description" label="Description" type="textarea" />
    <FormActions>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button type="submit">Save</Button>
    </FormActions>
  </Form>
);
```

### Loading Pattern
```typescript
const LoadingWidget = () => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <Skeleton className="h-4 w-32" />
    </CardHeader>
    <CardContent className="flex-1">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);
```

## Component Implementation Guidelines

### 1. Consistent Styling
All components should follow the established design system with:
- Consistent spacing (4px grid)
- Standardized color palette
- Typography hierarchy
- Shadow depth consistency

### 2. Accessibility
Every component must include:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### 3. Responsive Design
Components should be responsive by default:
- Mobile-first approach
- Flexible layouts
- Adaptive sizing
- Touch-friendly targets

### 4. Performance
Optimize components for performance:
- Minimal re-renders
- Efficient state management
- Lazy loading where appropriate
- Proper memoization

## Component Customizations

### Theme Variants
```typescript
// Primary variant
<Button variant="default">Primary</Button>

// Secondary variant  
<Button variant="secondary">Secondary</Button>

// Outline variant
<Button variant="outline">Outline</Button>
```

### Size Variants
```typescript
// Small size
<Button size="sm">Small</Button>

// Large size
<Button size="lg">Large</Button>

// Icon only
<Button size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

## Integration Points

### 1. React Query Integration
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['dashboard', dashboardId],
  queryFn: () => fetchDashboard(dashboardId)
});
```

### 2. Form Validation
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: initialValues
});
```

### 3. Real-time Updates
```typescript
const { data, isLoading } = useRealtimeQuery(
  'dashboard_updates',
  { dashboard_id: dashboardId }
);
```

This component catalog provides a comprehensive reference for implementing the Dashboard Workspace Application UI using shadcn/ui components. The components are organized by type and usage patterns to ensure consistency and maintainability throughout the application.