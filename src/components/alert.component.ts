import { LitElement } from 'lit';
import { customElement } from 'lit/decorators';
import { styled } from 'src/mixins/tailwind.mixin';

@customElement('mid-alert')
export class MinidAlert extends styled(LitElement) {}
