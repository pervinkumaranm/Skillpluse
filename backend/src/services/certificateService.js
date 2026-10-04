const Certificate = require('../models/Certificate');

class CertificateService {
  /**
   * Issue a certificate for a student who completed training
   */
  static async issueCertificate({ student, program, centre, skillsAcquired, grade }) {
    const existing = await Certificate.findOne({ student, program });
    if (existing) {
      return existing;
    }

    const certificate = await Certificate.create({
      student,
      program,
      centre,
      skillsAcquired,
      grade: grade || 'Pass',
    });

    return certificate;
  }

  /**
   * Verify a certificate by its ID
   */
  static async verifyCertificate(certificateId) {
    const certificate = await Certificate.findOne({ certificateId })
      .populate('student', 'name email')
      .populate('program', 'title duration')
      .populate('centre', 'centreName');

    if (!certificate) {
      return { valid: false, message: 'Certificate not found.' };
    }

    return {
      valid: certificate.isValid,
      certificate,
    };
  }
}

module.exports = CertificateService;
