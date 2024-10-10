import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/paragraph.component';
import { MinidParagraph } from '../components/paragraph.component';

const meta: Meta = {
  title: 'Typografi/Paragraph',
  component: 'mid-paragraph',
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;

type ParagraphProps = {
  size: MinidParagraph['size'];
  spacing: boolean;
};

type Story = StoryObj<ParagraphProps>;

export const Primary: Story = {
  render: ({ size, spacing }: ParagraphProps) => html`
    <mid-paragraph size="${size}" ?spacing=${spacing}
      >I et forsøk på å optimalisere ressursbruken, vil det bli iverksatt tiltak
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
  args: {},
};
