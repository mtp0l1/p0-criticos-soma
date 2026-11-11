/* So+ma · preset Tailwind gerado de tokens.json. Use com shadcn/ui: presets: [require('./tailwind.preset.js')] */
/* Cores, espaços, raios e sombra apontam para as variáveis de tokens.css: o valor muda num lugar só. */
module.exports = {
  "darkMode": [
    "class"
  ],
  "theme": {
    "colors": {
      "background-primary": "var(--background-primary)",
      "background-secondary": "var(--background-secondary)",
      "surface-primary": "var(--surface-primary)",
      "surface-secondary": "var(--surface-secondary)",
      "surface-accent": "var(--surface-accent)",
      "surface-inverse": "var(--surface-inverse)",
      "surface-brand": "var(--surface-brand)",
      "overlay": "var(--overlay)",
      "text-primary": "var(--text-primary)",
      "text-secondary": "var(--text-secondary)",
      "text-inverse": "var(--text-inverse)",
      "text-link": "var(--text-link)",
      "text-on-loud": "var(--text-on-loud)",
      "icon-brand": "var(--icon-brand)",
      "icon-brand-strong": "var(--icon-brand-strong)",
      "icon-primary": "var(--icon-primary)",
      "icon-secondary": "var(--icon-secondary)",
      "interactive-fill-loud": "var(--interactive-fill-loud)",
      "interactive-fill-loud-hover": "var(--interactive-fill-loud-hover)",
      "interactive-fill-loud-active": "var(--interactive-fill-loud-active)",
      "interactive-fill-quiet-hover": "var(--interactive-fill-quiet-hover)",
      "interactive-fill-quiet-active": "var(--interactive-fill-quiet-active)",
      "surface-secondary-hover": "var(--surface-secondary-hover)",
      "surface-accent-hover": "var(--surface-accent-hover)",
      "interactive-border-quiet": "var(--interactive-border-quiet)",
      "interactive-fill-disabled": "var(--interactive-fill-disabled)",
      "interactive-text-disabled": "var(--interactive-text-disabled)",
      "selected-indicator": "var(--selected-indicator)",
      "focus-ring": "var(--focus-ring)",
      "border-primary": "var(--border-primary)",
      "border-strong": "var(--border-strong)",
      "feedback-fill-positive": "var(--feedback-fill-positive)",
      "feedback-text-positive": "var(--feedback-text-positive)",
      "feedback-fill-negative": "var(--feedback-fill-negative)",
      "feedback-text-negative": "var(--feedback-text-negative)",
      "feedback-fill-negative-loud": "var(--feedback-fill-negative-loud)",
      "feedback-fill-caution": "var(--feedback-fill-caution)",
      "feedback-text-caution": "var(--feedback-text-caution)",
      "feedback-fill-informative": "var(--feedback-fill-informative)",
      "feedback-text-informative": "var(--feedback-text-informative)",
      "border-highlight": "var(--border-highlight)",
      "surface-track": "var(--surface-track)",
      "indicator-inactive": "var(--indicator-inactive)",
      "surface-info": "var(--surface-info)",
      "icon-info": "var(--icon-info)",
      "award-gold": "var(--award-gold)",
      "award-silver": "var(--award-silver)",
      "award-bronze": "var(--award-bronze)",
      "interactive-fill-destructive-hover": "var(--interactive-fill-destructive-hover)",
      "interactive-fill-destructive-active": "var(--interactive-fill-destructive-active)",
      "background": "var(--background)",
      "foreground": "var(--foreground)",
      "card": "var(--card)",
      "card-foreground": "var(--card-foreground)",
      "popover": "var(--popover)",
      "popover-foreground": "var(--popover-foreground)",
      "primary": "var(--primary)",
      "primary-foreground": "var(--primary-foreground)",
      "secondary": "var(--secondary)",
      "secondary-foreground": "var(--secondary-foreground)",
      "muted": "var(--muted)",
      "muted-foreground": "var(--muted-foreground)",
      "accent": "var(--accent)",
      "accent-foreground": "var(--accent-foreground)",
      "destructive": "var(--destructive)",
      "destructive-foreground": "var(--destructive-foreground)",
      "border": "var(--border)",
      "input": "var(--input)",
      "ring": "var(--ring)",
      "transparent": "transparent",
      "current": "currentColor",
      "inherit": "inherit"
    },
    "spacing": {
      "0": "0px",
      "px": "1px",
      "xnano": "var(--space-xnano)",
      "nano": "var(--space-nano)",
      "micro": "var(--space-micro)",
      "mini": "var(--space-mini)",
      "xsmall": "var(--space-xsmall)",
      "small": "var(--space-small)",
      "medium": "var(--space-medium)",
      "large": "var(--space-large)",
      "xlarge": "var(--space-xlarge)",
      "touch": "var(--size-touch)",
      "button": "var(--size-button)",
      "input": "var(--size-input)",
      "icon": "var(--size-icon)",
      "tile": "var(--size-tile)",
      "tabbar": "var(--size-tabbar)",
      "icon-small": "var(--size-icon-small)",
      "thumb": "var(--size-thumb)",
      "medal": "var(--size-medal)",
      "avatar": "var(--size-avatar)",
      "qr": "var(--size-qr)"
    },
    "borderRadius": {
      "none": "0px",
      "xs": "var(--radius-xsmall)",
      "sm": "var(--radius-small)",
      "md": "var(--radius-medium)",
      "lg": "var(--radius-large)",
      "xl": "var(--radius-xlarge)",
      "full": "var(--radius-full)"
    },
    "fontFamily": {
      "sans": [
        "var(--font-sans)"
      ]
    },
    "boxShadow": {
      "none": "none",
      "high": "var(--shadow-high)"
    },
    "extend": {
      "keyframes": {
        "fade-out": {"from": {"opacity": "1"}, "to": {"opacity": "0"}}, "zoom-out": {"from": {"opacity": "1", "transform": "translate(-50%,-50%) scale(1)"}, "to": {"opacity": "0", "transform": "translate(-50%,-48%) scale(.96)"}}, "slide-down": {"from": {"transform": "translateY(0)"}, "to": {"transform": "translateY(100%)"}}, "slide-in-top": {"from": {"transform": "translateY(-100%)"}, "to": {"transform": "translateY(0)"}}, "slide-out-top": {"from": {"transform": "translateY(0)"}, "to": {"transform": "translateY(-100%)"}}, "slide-in-left": {"from": {"transform": "translateX(-100%)"}, "to": {"transform": "translateX(0)"}}, "slide-out-left": {"from": {"transform": "translateX(0)"}, "to": {"transform": "translateX(-100%)"}}, "slide-in-right": {"from": {"transform": "translateX(100%)"}, "to": {"transform": "translateX(0)"}}, "slide-out-right": {"from": {"transform": "translateX(0)"}, "to": {"transform": "translateX(100%)"}}, "pop-in": {"from": {"opacity": "0", "transform": "scale(.96)"}, "to": {"opacity": "1", "transform": "scale(1)"}}, "pop-out": {"from": {"opacity": "1", "transform": "scale(1)"}, "to": {"opacity": "0", "transform": "scale(.96)"}}, "collapsible-down": {"from": {"height": "0"}, "to": {"height": "var(--radix-collapsible-content-height)"}}, "collapsible-up": {"from": {"height": "var(--radix-collapsible-content-height)"}, "to": {"height": "0"}}, "caret-blink": {"0%,70%,100%": {"opacity": "1"}, "20%,50%": {"opacity": "0"}},
        "fade-in": {
          "from": {
            "opacity": "0"
          },
          "to": {
            "opacity": "1"
          }
        },
        "zoom-in": {
          "from": {
            "opacity": "0",
            "transform": "translate(-50%,-48%) scale(.96)"
          },
          "to": {
            "opacity": "1",
            "transform": "translate(-50%,-50%) scale(1)"
          }
        },
        "slide-up": {
          "from": {
            "transform": "translateY(100%)"
          },
          "to": {
            "transform": "translateY(0)"
          }
        },
        "accordion-down": {
          "from": {
            "height": "0"
          },
          "to": {
            "height": "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          "from": {
            "height": "var(--radix-accordion-content-height)"
          },
          "to": {
            "height": "0"
          }
        }
      },
      "animation": {
        "fade-out": "fade-out .15s ease-out", "zoom-out": "zoom-out .15s ease-out", "slide-down": "slide-down .2s ease-in", "slide-in-top": "slide-in-top .2s ease-out", "slide-out-top": "slide-out-top .2s ease-in", "slide-in-left": "slide-in-left .2s ease-out", "slide-out-left": "slide-out-left .2s ease-in", "slide-in-right": "slide-in-right .2s ease-out", "slide-out-right": "slide-out-right .2s ease-in", "pop-in": "pop-in .15s ease-out", "pop-out": "pop-out .15s ease-out", "collapsible-down": "collapsible-down .2s ease-out", "collapsible-up": "collapsible-up .2s ease-out", "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-in": "fade-in .15s ease-out",
        "zoom-in": "zoom-in .15s ease-out",
        "slide-up": "slide-up .2s ease-out",
        "accordion-down": "accordion-down .2s ease-out",
        "accordion-up": "accordion-up .2s ease-out"
      }
    }
  }
};
