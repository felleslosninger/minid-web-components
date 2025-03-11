import inputStyles from '@digdir/designsystemet-css/input.css?inline';
import fieldStyles from '@digdir/designsystemet-css/field.css?inline';
import labelStyles from '@digdir/designsystemet-css/label.css?inline';
import validationStyles from '@digdir/designsystemet-css/validation-message.css?inline';
import { css } from 'lit';

export default [
  inputStyles,
  fieldStyles,
  labelStyles,
  validationStyles,
  css`
    .block {
      display: block;
    }
  `,
];
