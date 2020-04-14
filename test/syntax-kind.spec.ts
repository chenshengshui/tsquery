// Test Utilities:
import { SyntaxKind } from 'typescript';

import { tsquery } from '../src/index';

import { expect } from './index';

describe('tsquery:', () => {
  describe('tsquery - syntaxKindName:', () => {
    it('should return the string `NumericLiteral` for NumericLiteral syntax kind', () => {
      expect(tsquery.syntaxKindName(SyntaxKind.NumericLiteral)).to.equal(
        'NumericLiteral'
      );
    });

    it('should return the correct value for `NoSubstitutionTemplateLiteral` syntax kind', () => {
      expect(
        tsquery.syntaxKindName(SyntaxKind.NoSubstitutionTemplateLiteral)
      ).to.equal('NoSubstitutionTemplateLiteral');
    });
  });
});
