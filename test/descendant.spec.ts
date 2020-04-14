// Test Utilities:
import { IfStatement } from 'typescript';

import { tsquery } from '../src/index';

import { conditional } from './fixtures';
import { expect } from './index';

describe('tsquery:', () => {
  describe('tsquery - descendant:', () => {
    it('should find any nodes that are a descendant of another node', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, 'SourceFile IfStatement');

      expect(result).to.deep.equal([
        ast.statements[0],
        ast.statements[1],
        (ast.statements[1] as IfStatement).elseStatement,
      ]);
    });
  });
});
