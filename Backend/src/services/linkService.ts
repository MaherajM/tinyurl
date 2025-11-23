import { Link, ILink } from '../models/Link';

export class LinkService {
  generateCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createLink(code: string | undefined, target: string): Promise<ILink> {
    const shortCode = code || this.generateCode();

    const existing = await Link.findOne({ code: shortCode });
    if (existing) {
      throw new Error('CODE_EXISTS');
    }

    const link = new Link({
      code: shortCode,
      target
    });

    await link.save();
    return link;
  }

  async findLinkByCode(code: string): Promise<ILink | null> {
    return await Link.findOne({ code });
  }

  async incrementClicks(code: string): Promise<ILink | null> {
    const link = await Link.findOne({ code });

    if (!link) {
      return null;
    }
    console.log("Incrementing clicks for code:", code);
    link.clicks += 1;
    link.lastClickedAt = new Date();
    await link.save();

    return link;
  }

  async getLinkStats(code: string): Promise<ILink | null> {
    return await Link.findOne({ code });
  }

  async updateLink(code: string, target: string): Promise<ILink | null> {
    const link = await Link.findOne({ code });

    if (!link) {
      return null;
    }

    link.target = target;
    await link.save();

    return link;
  }

  async deleteLink(code: string): Promise<boolean> {
    const result = await Link.findOneAndDelete({ code });
    return result !== null;
  }

  async getAllLinks(limit: number = 100, skip: number = 0): Promise<ILink[]> {
    return await Link.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export default new LinkService();
