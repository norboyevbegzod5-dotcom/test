/**
 * Utility functions
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num)
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)} ₽`
}

/**
 * Convert mm to meters
 */
export function mmToMeters(mm: number): number {
  return mm / 1000
}

/**
 * Convert meters to mm
 */
export function metersToMm(meters: number): number {
  return meters * 1000
}

/**
 * Calculate area in square meters
 */
export function calculateArea(width: number, height: number): number {
  return (width * height) / 1000000 // mm² to m²
}
