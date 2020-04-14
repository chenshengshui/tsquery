// Test Utilities:
import { tsquery } from '../src/index';

import { simpleProgram } from './fixtures';
import { expect } from './index';

describe('tsquery:', () => {
  describe('tsquery - adjacent:', () => {
    it('should find any nodes that is a directly after of another node', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, 'VariableStatement + ExpressionStatement');

      expect(result).to.deep.equal([ast.statements[2]]);
    });
  });
});
