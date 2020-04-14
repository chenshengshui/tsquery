import { ScriptKind } from 'typescript';

import { tsquery } from '../src/index';

import { simpleJsxCode } from './fixtures';
import { expect } from './index';

describe('tsquery:', () => {
  describe('tsquery - jsx:', () => {
    it('should get a correct AST from jsx code', () => {
      const ast = tsquery.ast(simpleJsxCode, '', ScriptKind.JSX);

      expect(ast.statements.length).to.equal(3);
    });
  });
});
