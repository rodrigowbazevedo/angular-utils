import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
  chain,
} from '@angular-devkit/schematics';

import {
  addModuleImportToRootModule,
  getProjectFromWorkspace,
  WorkspaceProject,
  WorkspaceSchema,
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
        { type: NodeDependencyType.Default, version: '~8.0.1', name: '@ngrx/store' },
        { type: NodeDependencyType.Default, version: '~1.1.0', name: 'kv-storage-polyfill' },
        { type: NodeDependencyType.Default, version: '~4.17.15', name: 'lodash' },
        { type: NodeDependencyType.Default, version: '~0.0.5', name: '@rodrigowba/ngrx-persist' }
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

export function addModule(options: any): Rule {
  return (host: Tree, _context: SchematicContext) => {
    // get the workspace config of the consuming project
    // i.e. angular.json file
    const workspace: WorkspaceSchema = getWorkspace(host);

    // identify the project config which is using our library
    // or default to the default project in consumer workspace
    const project: WorkspaceProject = getProjectFromWorkspace(
      workspace,
      options.project || workspace.defaultProject
    );

    if (!project) {
      throw new SchematicsException(`Invalid project name (${options.project})`);
    }

    // inject our module into the current main module of the selected project
    addModuleImportToRootModule(
      // tree to modify
      host,
      // Module name to insert
      'PersistStateModule.forRoot(\'BUILD_ID\')',
      // project name for import statement
      '@rodrigowba/ngrx-persist',
      // project to be modified
      project
    );

    // return updated tree
    return host;
  };
}

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    return chain([
        addPackageJsonDependencies(),
        installPackageJsonDependencies(),
        addModule(options),
    ])(host, context);
  };
}
