/**
 * So+ma · design system.
 * Arquitetura do shadcn/ui: primitivas em ui/ (Radix + class-variance-authority + Tailwind + cn),
 * componentes de produto em soma/ montados sobre elas. Tokens: tokens.json → tokens.css → tailwind.preset.js.
 */
export { cn, focusRing, disabledState, hitArea } from './lib/utils';

/* Primitivas (camada shadcn/ui) */
export { Icon, ICONS, ICON_ALIASES, iconVariants, type IconName, type IconProps } from './ui/icon';
export { Button, IconButton, buttonVariants, type ButtonProps, type IconButtonProps } from './ui/button';
export {
  Badge, badgeVariants, type BadgeProps,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants, type CardProps,
  Separator, type SeparatorProps,
  Progress, type ProgressProps,
  Avatar, AvatarImage, AvatarFallback, avatarVariants, type AvatarProps,
  Skeleton, type SkeletonProps,
  Alert, AlertTitle, AlertDescription, alertVariants, type AlertProps,
  CardAction,
} from './ui/display';
export {
  Label, Input, Textarea, Checkbox, Switch, RadioGroup, RadioGroupItem,
  Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator,
  type InputProps, type TextareaProps,
  fieldBase,
} from './ui/form';
export {
  Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
  Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, sheetVariants,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
  Popover, PopoverTrigger, PopoverAnchor, PopoverContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  TabsRoot, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants,
  type DialogContentProps, type SheetContentProps, type AlertDialogActionProps, type TabsListProps,
  PopoverClose, AlertDialogPortal,
} from './ui/overlay';

/* Componentes So+ma (camada de produto) */
export { Header, LocationBar, TabBar, Tabs, SegmentedControl, SectionHeader, ListRow, StepDots, listRowVariants, TAB_ITEMS } from './soma/navigation';
export type { HeaderProps, LocationBarProps, TabBarProps, TabId, TabsProps, TabsItem, SectionHeaderProps, ListRowProps, StepDotsProps } from './soma/navigation';
export { Tile, TileGrid, BalanceCard, QuestionTeaser, GoalSummaryCard, ActivityRow } from './soma/home';
export type { TileProps, BalanceCardProps, QuestionTeaserProps, GoalSummaryCardProps, ActivityRowProps } from './soma/home';
export { Trophy, LevelCard, LevelBadge, TierCard, ProtectionNotice, QuestionCard, PointsBadge, StreakTrail, StreakProgress, StreakSection, AnswerResult, DailyDone, HistorySummary, AnswerHistory, AnswerHistoryRow, MilestoneResult, TIER_NAME, TIER_LEVEL, TIER_GOAL, TIER_NEXT, TIER_STARS } from './soma/quiz';
export { Illustration, ILLUSTRATIONS } from './soma/illustration';
export type { IllustrationProps, IllustrationName } from './soma/illustration';
export type { Tier, TrophyProps, LevelCardProps, LevelBadgeProps, TierCardProps, ProtectionNoticeProps, QuestionCardProps, PointsBadgeProps, StreakTrailProps, StreakDayState, StreakDay, StreakProgressProps, StreakSectionProps, AnswerResultProps, DailyDoneProps, HistorySummaryProps, AnswerHistoryProps, AnswerHistoryRowProps, AnswerResultKind, MilestoneResultProps } from './soma/quiz';
export { StatTile, StatGrid, PositionCard, Podium, RankingRow, RankingList, RankingStarterCard, StatsRow, ImpactTiles, statTileVariants } from './soma/impact';
export type { StatTileProps, PositionCardProps, PodiumProps, PodiumEntry, RankingRowProps, RankingStarterCardProps, StatsRowProps, ImpactTilesProps } from './soma/impact';
export { StatusChip, Tag, Thumb, RedemptionItem, RedemptionGroup, QrCheckinCard } from './soma/account';
export type { StatusChipProps, TagProps, ThumbProps, RedemptionItemProps, QrCheckinCardProps } from './soma/account';
export { SearchField, TextField, ChoiceChips, RadioList, MaterialResult, HelpfulVote } from './soma/forms';
export type { SearchFieldProps, TextFieldProps, ChoiceOption, ChoiceChipsProps, RadioListProps, MaterialResultProps, HelpfulVoteProps } from './soma/forms';
export { Modal, Toast, Toaster, notify, Message, EmptyState, ResultScreen, toastVariants } from './soma/feedback';
export type { ModalProps, ToastProps, ToasterProps, NotifyOptions, MessageProps, EmptyStateProps, ResultScreenProps } from './soma/feedback';
export { GoalCard, CampaignBanner, RewardRow, RedeemCode, RewardDetail, InstitutionCard } from './soma/rewards';
export type { GoalCardProps, CampaignBannerProps, RewardRowProps, RewardTag, RedeemCodeProps, RewardDetailProps, InstitutionCardProps } from './soma/rewards';
export { DeliveryCard, SpaceCard, SpaceDetail, SlotPicker } from './soma/recycle';
export type { DeliveryCardProps, SpaceCardProps, SpaceDetailProps, SlotPickerProps, Slot } from './soma/recycle';
export { InviteCodeCard, FriendRequestSheet, ContactRow } from './soma/social';
export type { InviteCodeCardProps, FriendRequestSheetProps, ContactRowProps } from './soma/social';

/* shadcn/ui: controles */
export { Spinner, ButtonGroup, buttonGroupVariants, Toggle, ToggleGroup, ToggleGroupItem, toggleVariants, Slider, NativeSelect, InputGroup, InputGroupInput, InputGroupAddon, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, FieldSet, FieldLegend, FieldGroup, Field, FieldLabel, FieldContent, FieldDescription, FieldError, FieldSeparator, fieldVariants } from './ui/controls';
export type { SpinnerProps, ButtonGroupProps, ToggleProps, ToggleGroupProps, SliderProps, NativeSelectProps, InputGroupAddonProps, InputOTPSlotProps, FieldProps } from './ui/controls';
/* shadcn/ui: estrutura */
export { AspectRatio, ScrollArea, ScrollBar, Collapsible, CollapsibleTrigger, CollapsibleContent, Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from './ui/layout';
export type { PaginationLinkProps, CarouselProps } from './ui/layout';
/* shadcn/ui: menus e sobreposição */
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuRadioGroup, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubTrigger, DropdownMenuSubContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandSeparator, CommandItem, Combobox, Drawer, DrawerTrigger, DrawerPortal, DrawerClose, DrawerOverlay, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from './ui/menus';
export type { DropdownMenuItemProps, ComboboxProps, ComboboxOption } from './ui/menus';
