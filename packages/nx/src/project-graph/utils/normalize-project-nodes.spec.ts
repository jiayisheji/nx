import { ProjectGraphProjectNode } from '../../config/project-graph';
import {
  normalizeImplicitDependencies,
  normalizeProjectTargets,
} from './normalize-project-nodes';

describe('workspace-projects', () => {
  let projectGraph: Record<string, ProjectGraphProjectNode> = {
    'test-project': {
      name: 'test-project',
      type: 'lib',
      data: {
        root: 'lib/test-project',
        tags: ['api', 'theme1'],
      },
    },
    a: {
      name: 'a',
      type: 'lib',
      data: {
        root: 'lib/a',
        tags: ['api', 'theme2'],
      },
    },
    b: {
      name: 'b',
      type: 'lib',
      data: {
        root: 'lib/b',
        tags: ['ui'],
      },
    },
    c: {
      name: 'c',
      type: 'lib',
      data: {
        root: 'lib/c',
        tags: ['api'],
      },
    },
  };

  describe('normalizeImplicitDependencies', () => {
    it('should expand "*" implicit dependencies', () => {
      expect(
        normalizeImplicitDependencies('test-project', ['*'], projectGraph)
      ).toEqual(['a', 'b', 'c']);
    });

    it('should return [] for null implicit dependencies', () => {
      expect(
        normalizeImplicitDependencies('test-project', null, projectGraph)
      ).toEqual([]);
    });

    it('should expand glob based implicit dependencies', () => {
      const projectGraphMod: typeof projectGraph = {
        ...projectGraph,
        'b-1': {
          name: 'b-1',
          type: 'lib',
          data: {
            root: 'lib/b-1',
            tags: [],
          },
        },
        'b-2': {
          name: 'b-2',
          type: 'lib',
          data: {
            root: 'lib/b-2',
            tags: [],
          },
        },
      };
      expect(
        normalizeImplicitDependencies('test-project', ['b*'], projectGraphMod)
      ).toEqual(['b', 'b-1', 'b-2']);
    });
  });

  describe('normalizeTargets', () => {
    it('should convert command property to run-commands executor', () => {
      expect(
        normalizeProjectTargets(
          {
            root: 'my/project',
            targets: {
              build: {
                command: 'echo',
              },
            },
          },
          'build'
        ).build
      ).toEqual({
        executor: 'nx:run-commands',
        configurations: {},
        options: {
          command: 'echo',
        },
      });
    });

    it('should support {projectRoot}, {workspaceRoot}, and {projectName} tokens', () => {
      expect(
        normalizeProjectTargets(
          {
            name: 'project',
            root: 'my/project',
            targets: {
              build: {
                executor: 'target',
                options: {
                  a: '{projectRoot}',
                  b: '{workspaceRoot}',
                  c: '{projectName}',
                },
              },
            },
          },
          'build'
        ).build.options
      ).toEqual({ a: 'my/project', b: '', c: 'project' });
    });
  });
});
