import { lazy } from 'react';

// Lazy load animation components to reduce initial bundle size
export const TalkAnimation = lazy(() => import('./TalkAnimation'));
export const TalkExplanationAnimation = lazy(() => import('./TalkExplanationAnimation'));
export const TalkHeroAnimation = lazy(() => import('./TalkHeroAnimation'));