import { trigger, state, style, transition, animate, keyframes } from '@angular/core';

export const animations = [
	trigger('entry', [
		transition('void => *', [
			animate(100, keyframes([
				style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
				style({opacity: 1, transform: 'translateX(0)', offset: 1}),
			]))
		])
	]),
	trigger('select', [
		transition('void => *', [
			animate(150, keyframes([
				style({transform: 'translateX(-70%) scale(0.3)', offset: 0}),
				style({transform: 'translateX(0) scale(1)', offset: 1}),
			]))
		]),
		transition('* => void', [
			animate(150, keyframes([
				style({opacity: 1, transform: 'translateX(0) scale(1)', offset: 0}),
				style({opacity: 0, transform: 'translateX(-70%) scale(0.3)', offset: 0.8}),
				style({opacity: 0, transform: 'translateX(-70%) scale(0)', offset: 1}),
			]))
		]),
		transition('* => *', [
			animate(300, keyframes([
				style({opacity: 1, transform: 'scale(1)', offset: 0}),
				style({opacity: 0, transform: 'scale(0.3)', offset: 0.3}),
				style({opacity: 1, transform: 'scale(1)', offset: 1}),
			]))
		])
	])
]