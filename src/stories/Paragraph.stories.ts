import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/paragraph.component';
import { MinidParagraph } from '../components/paragraph.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type ParagraphProps = {
  size?: MinidParagraph['size'];
  variant?: MinidParagraph['variant'];
  spacing?: MinidParagraph['spacing'];
};

const meta: Meta = {
  title: 'Typografi/Paragraph',
  component: 'mid-paragraph',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['short', 'default', 'long'],
    },
    spacing: {
      control: { type: 'number', min: 0, max: 6 },
    },
  },
};

export default meta;

type Story = StoryObj<ParagraphProps>;

export const Main: Story = {
  render: ({ size, spacing, variant }: ParagraphProps) => html`
    <mid-paragraph
      size=${ifDefined(size)}
      spacing=${ifDefined(spacing)}
      variant=${ifDefined(variant)}
    >
      I et forsøk på å optimalisere ressursbruken, vil det bli iverksatt tiltak
      for å styrke den offentlige sektors bærekraftige utvikling. Gjennom
      implementering av strategiske handlingsplaner og evaluering av
      eksisterende prosjekter, søker vi å forbedre den administrative
      effektiviteten. Videre vil vi fokusere på interkommunalt samarbeid for å
      fremme samfunnsutvikling, samt sørge for at alle tjenester er i tråd med
      gjeldende lovverk og forskrifter. Det er avgjørende å opprettholde et
      transparent system som sikrer innbyggernes rettigheter og tilgang til
      informasjon, i samsvar med offentlighetsloven.
    </mid-paragraph>
    <mid-paragraph
      size="${ifDefined(size)}"
      spacing=${ifDefined(spacing)}
      variant=${ifDefined(variant)}
    >
      I et forsøk på å optimalisere ressursbruken, vil det bli iverksatt tiltak
      for å styrke den offentlige sektors bærekraftige utvikling. Gjennom
      implementering av strategiske handlingsplaner og evaluering av
      eksisterende prosjekter, søker vi å forbedre den administrative
      effektiviteten. Videre vil vi fokusere på interkommunalt samarbeid for å
      fremme samfunnsutvikling, samt sørge for at alle tjenester er i tråd med
      gjeldende lovverk og forskrifter. Det er avgjørende å opprettholde et
      transparent system som sikrer innbyggernes rettigheter og tilgang til
      informasjon, i samsvar med offentlighetsloven.
    </mid-paragraph>
  `,
};
