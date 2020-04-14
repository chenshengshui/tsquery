// Test Utilities:
import {
  BinaryExpression,
  Block,
  CallExpression,
  ExpressionStatement,
  FunctionDeclaration,
  IfStatement,
  VariableDeclaration,
  VariableStatement,
} from 'typescript';
import * as ts from 'typescript';

import { tsquery } from '../src/index';
import { getProperties } from '../src/traverse';

import { conditional, simpleFunction, simpleProgram } from './fixtures';
import { expect } from './index';

describe('tsquery:', () => {
  describe('tsquery - attribute:', () => {
    it('should find any nodes with a property with a value that matches a specific value', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[name="x"]');

      expect(result).to.deep.equal([
        ((ast.statements[0] as IfStatement).expression as BinaryExpression)
          .left,
        ((((ast.statements[0] as IfStatement).elseStatement as Block)
          .statements[0] as ExpressionStatement).expression as BinaryExpression)
          .left,
        ((((ast.statements[1] as IfStatement).expression as BinaryExpression)
          .left as BinaryExpression).left as BinaryExpression).left,
        ((ast.statements[1] as IfStatement).expression as BinaryExpression)
          .right,
      ]);
    });

    it('should find any nodes with a property with a value that does not match a specific value', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[name!="x"]');

      expect(result).to.deep.equal([
        ((((ast.statements[0] as IfStatement).thenStatement as Block)
          .statements[0] as ExpressionStatement).expression as CallExpression)
          .expression,
        ((((ast.statements[1] as IfStatement).thenStatement as Block)
          .statements[0] as ExpressionStatement).expression as BinaryExpression)
          .left,
        (((((ast.statements[1] as IfStatement).elseStatement as IfStatement)
          .thenStatement as Block).statements[0] as ExpressionStatement)
          .expression as BinaryExpression).left,
      ]);
    });

    it('should find any nodes with a nested property with a specific value', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[expression.name="foo"]');

      expect(result).to.deep.equal([
        (((ast.statements[0] as IfStatement).thenStatement as Block)
          .statements[0] as ExpressionStatement).expression,
      ]);
    });

    it('should find any nodes with a nested properties including array values', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(
        ast,
        'FunctionDeclaration[parameters.0.name.name="x"]'
      );

      expect(result).to.deep.equal([ast.statements[0]]);
    });

    it('should find any nodes with a specific property', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[thenStatement]');

      expect(result).to.deep.equal([
        ast.statements[0],
        ast.statements[1],
        (ast.statements[1] as IfStatement).elseStatement as IfStatement,
      ]);
    });

    it('should support synthesized nodes', () => {
      const ast = ts.createVariableStatement(undefined, [
        ts.createVariableDeclaration('answer', undefined, ts.createLiteral(42)),
      ]);
      const result = tsquery(ast, '[text="answer"]');

      expect(result).to.deep.equal([ast.declarationList.declarations[0].name]);
    });
  });

  describe('tsquery - attribute operators:', () => {
    it('should find any nodes with an attribute with a value that matches a RegExp', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(ast, '[name=/x|foo/]');

      expect(result).to.deep.equal([
        (ast.statements[0] as FunctionDeclaration).name,
        (ast.statements[0] as FunctionDeclaration).parameters[0].name,
        (((((ast.statements[0] as FunctionDeclaration).body as Block)
          .statements[0] as VariableStatement).declarationList
          .declarations[0] as VariableDeclaration)
          .initializer as BinaryExpression).left,
      ]);
    });

    it('should find any nodes with an attribute with a value that does not match a RegExp', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(ast, '[name!=/x|y|z/]');

      expect(result).to.deep.equal([
        (ast.statements[0] as FunctionDeclaration).name,
      ]);
    });

    it('should find any nodes with an attribute with a value that is greater than or equal to a value', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[statements.length>=4]');

      expect(result).to.deep.equal([ast]);
    });

    it('should find any nodes with an attribute with a value that is greater than a value', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[statements.length>3]');

      expect(result).to.deep.equal([ast]);
    });

    it('should find any nodes with an attribute with a value that is less than or equal to a value', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[statements.length<=1]');

      expect(result).to.deep.equal([
        (ast.statements[3] as IfStatement).thenStatement,
      ]);
    });

    it('should find any nodes with an attribute with a value that is a specific type', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[value=type(boolean)]');

      expect(result).to.deep.equal([
        (((ast.statements[1] as IfStatement).expression as BinaryExpression)
          .left as BinaryExpression).right,
        ((ast.statements[1] as IfStatement).elseStatement as IfStatement)
          .expression,
      ]);
      expect(
        result.every((node) => typeof getProperties(node).value === 'boolean')
      ).to.equal(true);
    });

    it('should find any nodes with an attribute with a value that is not a specific type', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[value!=type(string)]');

      expect(result).to.deep.equal([
        (ast.statements[0] as VariableStatement).declarationList.declarations[0]
          .initializer,
        (((ast.statements[2] as ExpressionStatement)
          .expression as BinaryExpression).right as BinaryExpression).right,
      ]);
      expect(
        result.every((node) => typeof getProperties(node).value !== 'string')
      ).to.equal(true);
    });
  });
});