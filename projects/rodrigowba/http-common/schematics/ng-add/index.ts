import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  Rule,
  Tree,
  SchematicContext,
  chain,
} from '@angular-devkit/schematics';

import {
  getWorkspace,
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType
} from 'schematics-utilities';
import { normalize, join } from '@angular-devkit/core';

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src');

  return host;
}

function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '^8', name: '@ngrx/entity' },
      { type: NodeDependencyType.Default, version: '^1.2.0', name: 'json-hash' },
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

export default function (options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    return chain([
      addPackageJsonDependencies(),
      installPackageJsonDependencies(),
    ])(host, context);
  };
}
