/**
 * So+ma · design system.
 * Arquitetura do shadcn/ui: primitivas em ui/ (Radix + class-variance-authority + Tailwind + cn),
 * componentes de produto em soma/ montados sobre elas. Tokens: tokens.json → tokens.css → tailwind.preset.js.
 */
export { cn, focusRing } from './lib/utils';

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
} from './ui/display';
export {
  Label, Input, Textarea, Checkbox, Switch, RadioGroup, RadioGroupItem,
  Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator,
  type InputProps, type TextareaProps,
} from './ui/form';
export {
  Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
  Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, sheetVariants,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
  Popover, PopoverTrigger, PopoverAnchor, PopoverContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  TabsRoot, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants,
  type DialogContentProps, type SheetContentProps, type AlertDialogActionProps, type TabsListProps,
} from './ui/overlay';

/* Componentes So+ma (camada de produto) */
export { Header, LocationBar, TabBar, Tabs, SegmentedControl, SectionHeader, ListRow, StepDots, listRowVariants, TAB_ITEMS } from './soma/navigation';
export type { HeaderProps, LocationBarProps, TabBarProps, TabBarVersion, TabId, TabsProps, TabsItem, SectionHeaderProps, ListRowProps, StepDotsProps } from './soma/navigation';
export { Tile, TileGrid, BalanceCard, MissionBanner, StepChecklist } from './soma/home';
export type { TileProps, BalanceCardProps, MissionBannerProps, StepChecklistProps } from './soma/home';
export { Medal, LevelCard, QuestionCard, LevelList, LevelBadge, PointsBadge, StreakTrail, StreakProgress, TIER_NAME } from './soma/quiz';
export type { Tier, MedalProps, LevelCardProps, QuestionCardProps, LevelListProps, LevelBadgeProps, PointsBadgeProps, StreakTrailProps, StreakDayState, StreakProgressProps } from './soma/quiz';
export { StatTile, StatGrid, RankingBanner, PositionCard, Podium, RankingRow, RankingList, StatsRow, statTileVariants } from './soma/impact';
export type { StatTileProps, RankingBannerProps, PositionCardProps, PodiumProps, PodiumEntry, RankingRowProps, StatsRowProps } from './soma/impact';
export { StatusChip, Tag, Thumb, RedemptionItem, RedemptionGroup, MemberCard } from './soma/account';
export type { StatusChipProps, TagProps, ThumbProps, RedemptionItemProps, MemberCardProps } from './soma/account';
export { SearchField, TextField, ChoiceChips, RadioList, MaterialResult, HelpfulVote } from './soma/forms';
export type { SearchFieldProps, TextFieldProps, ChoiceOption, ChoiceChipsProps, RadioListProps, MaterialResultProps, HelpfulVoteProps } from './soma/forms';
export { Modal, Toast, Message, EmptyState, ResultScreen, toastVariants } from './soma/feedback';
export type { ModalProps, ToastProps, MessageProps, EmptyStateProps, ResultScreenProps } from './soma/feedback';
export { GoalCard, CampaignBanner, RewardRow, RedeemCode, InstitutionCard } from './soma/rewards';
export type { GoalCardProps, CampaignBannerProps, RewardRowProps, RewardTag, RedeemCodeProps, InstitutionCardProps } from './soma/rewards';
export { DeliveryCard, SpaceCard, SlotPicker } from './soma/recycle';
export type { DeliveryCardProps, SpaceCardProps, SlotPickerProps, Slot } from './soma/recycle';
