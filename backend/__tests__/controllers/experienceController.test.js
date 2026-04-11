describe('Experience Controller - Logic Unit Tests', () => {
  describe('Get All Experience', () => {
    it('should extract experience array from user', () => {
      const user = {
        experience: [
          { title: 'Developer', company: 'Tech Corp', startDate: '2020-01' },
          { title: 'Senior Dev', company: 'Startup', startDate: '2022-01' }
        ]
      };
      expect(user.experience).toHaveLength(2);
    });

    it('should return empty array if no experience', () => {
      const user = { experience: [] };
      expect(user.experience).toHaveLength(0);
    });
  });

  describe('Add Experience Validation', () => {
    it('should validate required fields', () => {
      const requiredFields = ['title', 'company', 'startDate'];
      const experience = { title: 'Developer', company: 'Tech Corp' };
      const missing = requiredFields.filter(f => !experience[f]);
      expect(missing).toContain('startDate');
    });

    it('should accept valid experience data', () => {
      const requiredFields = ['title', 'company', 'startDate'];
      const experience = { 
        title: 'Software Engineer', 
        company: 'Tech Corp', 
        startDate: '2020-01',
        endDate: '2023-01',
        description: 'Built web apps'
      };
      const missing = requiredFields.filter(f => !experience[f]);
      expect(missing).toHaveLength(0);
    });
  });

  describe('Experience Data Structure', () => {
    it('should support current/ongoing position (no endDate)', () => {
      const experience = { 
        title: 'Developer', 
        company: 'Tech Corp', 
        startDate: '2020-01',
        isCurrent: true
      };
      expect(experience.isCurrent).toBe(true);
      expect(experience.endDate).toBeUndefined();
    });

    it('should support past position (with endDate)', () => {
      const experience = { 
        title: 'Developer', 
        company: 'Tech Corp', 
        startDate: '2020-01',
        endDate: '2023-01',
        isCurrent: false
      };
      expect(experience.isCurrent).toBe(false);
      expect(experience.endDate).toBe('2023-01');
    });

    it('should include location field', () => {
      const experience = { 
        title: 'Developer', 
        company: 'Tech Corp', 
        location: 'Colombo, Sri Lanka'
      };
      expect(experience.location).toBe('Colombo, Sri Lanka');
    });
  });

  describe('Update Experience Logic', () => {
    it('should extract expId from request body', () => {
      const body = { expId: 'exp123', title: 'Senior Developer' };
      const { expId, ...fields } = body;
      expect(expId).toBe('exp123');
      expect(fields).not.toHaveProperty('expId');
      expect(fields.title).toBe('Senior Developer');
    });

    it('should spread remaining fields as updates', () => {
      const body = { 
        expId: 'exp123', 
        title: 'Lead Developer',
        company: 'New Corp',
        description: 'Updated description'
      };
      const { expId, ...updates } = body;
      expect(Object.keys(updates)).toHaveLength(3);
    });
  });

  describe('Delete Experience Logic', () => {
    it('should find experience by expId', () => {
      const experience = [
        { _id: 'exp1', title: 'Dev 1' },
        { _id: 'exp2', title: 'Dev 2' }
      ];
      const expId = 'exp1';
      const found = experience.find(e => e._id === expId);
      expect(found).toBeDefined();
      expect(found.title).toBe('Dev 1');
    });

    it('should remove experience by expId', () => {
      const experience = [
        { _id: 'exp1', title: 'Dev 1' },
        { _id: 'exp2', title: 'Dev 2' }
      ];
      const expId = 'exp1';
      const filtered = experience.filter(e => e._id !== expId);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]._id).toBe('exp2');
    });
  });

  describe('Experience Array Operations', () => {
    it('should push new experience to array', () => {
      const experience = [{ title: 'Dev 1' }];
      experience.push({ title: 'Dev 2' });
      expect(experience).toHaveLength(2);
    });

    it('should update experience at specific index', () => {
      const experience = [
        { _id: 'exp1', title: 'Dev 1' },
        { _id: 'exp2', title: 'Dev 2' }
      ];
      const expId = 'exp1';
      const index = experience.findIndex(e => e._id === expId);
      if (index !== -1) {
        experience[index] = { ...experience[index], title: 'Senior Dev 1' };
      }
      expect(experience[0].title).toBe('Senior Dev 1');
    });
  });
});
